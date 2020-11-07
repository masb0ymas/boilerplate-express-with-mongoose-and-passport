/* eslint-disable no-unused-vars */
import models from 'models'
import jwt from 'jsonwebtoken'
import { getUniqueCodev2 } from 'helpers/Common'
import {
  setUserPassword,
  LoginAttributes,
  TokenAttributes,
  UserAttributes,
} from 'models/User'
import useValidation from 'helpers/useValidation'
import schema from 'controllers/User/schema'
import createDirNotExist from 'utils/Directory'
import ResponseError from 'modules/Response/ResponseError'
import { isObject } from 'lodash'

require('dotenv').config()

const { User } = models

const { JWT_SECRET }: any = process.env
const expiresToken = 7 * 24 * 60 * 60 // 7 Days

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
   * Sign Up
   */
  public static async signUp(formData: UserAttributes) {
    const generateToken = {
      code: getUniqueCodev2(),
    }

    const tokenVerify = jwt.sign(
      JSON.parse(JSON.stringify(generateToken)),
      JWT_SECRET,
      {
        expiresIn: expiresToken,
      }
    ) // 1 Days
    const password = setUserPassword(formData)
    const newFormData = {
      ...formData,
      tokenVerify,
      password,
    }

    const value = useValidation(schema.create, newFormData)
    const data = await User.create(value)
    const message =
      'registration is successful, check your email for the next steps'

    return { data, message }
  }

  /**
   * Sign In
   */
  public static async signIn(formData: LoginAttributes) {
    const { email, password } = useValidation(schema.login, formData)

    const userData = await User.findOne({ email }).select('-tokenVerify')

    if (!userData) {
      throw new ResponseError.NotFound('data not found or has been deleted')
    }

    /* User active proses login */
    if (userData.active) {
      // @ts-ignore
      const comparePassword = await userData.comparePassword(password)

      if (comparePassword) {
        // modif payload token
        const payloadToken = {
          _id: userData._id,
          nama: userData.fullName,
          active: userData.active,
        }

        const token = jwt.sign(
          JSON.parse(JSON.stringify(payloadToken)),
          JWT_SECRET,
          {
            expiresIn: expiresToken,
          }
        ) // 1 Days

        // create directory
        await createDirectory(userData._id)

        return {
          token,
          expiresIn: expiresToken,
          tokenType: 'Bearer',
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
   * Get Profile
   */
  public static async profile(token: TokenAttributes) {
    if (isObject(token?.data)) {
      const decodeToken = token?.data

      // @ts-ignore
      const data = await User.findById(decodeToken?._id)
        .populate([{ path: 'Role' }])
        .select('-password -tokenVerify')
      return data
    }

    throw new ResponseError.Unauthorized(
      `${token?.message}. Please Re-login...`
    )
  }
}

export default AuthService
