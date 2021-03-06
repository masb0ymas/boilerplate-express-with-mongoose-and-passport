import models from 'models'
import ms from 'ms'
import jwt from 'jsonwebtoken'
import { getUniqueCodev2 } from '@expresso/helpers/Common'
import { setUserPassword, LoginAttributes, UserAttributes } from 'models/User'
import useValidation from '@expresso/hooks/useValidation'
import createDirNotExist from 'utils/Directory'
import ResponseError from '@expresso/modules/Response/ResponseError'
import SendMail from '@expresso/helpers/SendEmail'
import UserService from 'controllers/User/service'
import RefreshTokenService from 'controllers/RefreshToken/service'
import authSchema from './schema'

require('dotenv').config()

const { User } = models

const { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN }: any = process.env

const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED || '1d' // 1 Days
const JWT_REFRESH_TOKEN_EXPIRED = process.env.JWT_REFRESH_TOKEN_EXPIRED || '30d' // 30 Days

const expiresIn = ms(JWT_ACCESS_TOKEN_EXPIRED) / 1000

/*
  Create the main directory
  The directory will be created automatically when logged in,
  because there is a directory that uses a User ID
*/
async function createDirectory(UserId: string) {
  const pathDirectory = [
    './public/uploads/csv',
    './public/uploads/excel',
    `./public/uploads/profile/${UserId}`,
  ]

  pathDirectory.map((x) => createDirNotExist(x))
}

class AuthService {
  /**
   *
   * @param formData
   */
  public static async signUp(formData: UserAttributes) {
    await UserService.validateUserByEmail(formData.email)

    const generateToken = {
      code: getUniqueCodev2(),
    }

    const tokenRegister = jwt.sign(
      JSON.parse(JSON.stringify(generateToken)),
      JWT_SECRET_ACCESS_TOKEN,
      {
        expiresIn,
      }
    )

    const password = setUserPassword(formData)
    const newFormData = {
      ...formData,
      tokenVerify: tokenRegister,
      password,
    }

    const value = useValidation(authSchema.register, newFormData)
    const data = await User.create(value)

    // Initial Send an e-mail
    SendMail.AccountRegister(formData, tokenRegister)

    const message =
      'registration is successful, check your email for the next steps'

    return { data, message }
  }

  /**
   *
   * @param formData
   */
  public static async signIn(formData: LoginAttributes) {
    const { email, password } = useValidation(authSchema.login, formData)

    const userData = await User.findOne({ email }).select('-tokenVerify')

    if (!userData) {
      throw new ResponseError.NotFound('account not found')
    }

    const { _id: UserId } = userData

    /* User active proses login */
    if (userData.active) {
      // @ts-ignore
      const comparePassword = await userData.comparePassword(
        password,
        userData.password
      )

      if (comparePassword) {
        // modif payload token
        const payloadToken = { _id: UserId }

        // Access Token
        const accessToken = jwt.sign(
          JSON.parse(JSON.stringify(payloadToken)),
          JWT_SECRET_ACCESS_TOKEN,
          {
            expiresIn,
          }
        )

        // Refresh Token
        const refreshToken = jwt.sign(
          JSON.parse(JSON.stringify(payloadToken)),
          JWT_SECRET_REFRESH_TOKEN,
          {
            expiresIn: JWT_REFRESH_TOKEN_EXPIRED,
          }
        )

        const formDataRefreshToken = {
          UserId,
          token: refreshToken,
        }

        await RefreshTokenService.create(formDataRefreshToken)

        // create directory
        await createDirectory(UserId)

        return {
          message: 'Login successfully',
          accessToken,
          expiresIn,
          tokenType: 'Bearer',
          refreshToken,
          user: payloadToken,
        }
      }

      throw new ResponseError.BadRequest('incorrect email or password!')
    }

    /* User not active return error confirm email */
    throw new ResponseError.BadRequest(
      'please check your email account to verify your email and continue the registration process.'
    )
  }

  /**
   *
   * @param _id
   */
  public static async profile(_id: string) {
    const data = await User.findById(_id)
      .populate([{ path: 'Role' }])
      .select('-password -tokenVerify')

    return data
  }

  /**
   *
   * @param userId
   */
  public static async logout(userId: string) {
    const userData = await UserService.getOne(userId)

    // remove refresh token by user id
    await RefreshTokenService.delete(userData.id)
    const message = 'You have logged out of the application'

    return message
  }
}

export default AuthService
