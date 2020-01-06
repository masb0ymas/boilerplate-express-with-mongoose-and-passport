import 'dotenv/config'
import * as yup from 'yup'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from './user.model'
// import SendMailer from '../../config/email'
import {
  getToken,
  getUniqueCodev2,
  convertQueryFilter,
  validationRequest,
} from '#helpers'
import createDirNotExist from '#utils/Directory'

const jwtPass = process.env.JWT_SECRET

const invalidValues = [undefined, null, '']

/*
  Create the main directory
  direktori akan dibikin otomatis ketika login,
  karna direktori ada yang menggunakan User ID
*/
async function createDirectory(userData) {
  const pathDirectory = [
    './public/uploads/csv',
    `./public/uploads/profile/${userData.id}`,
  ]

  pathDirectory.map(x => createDirNotExist(x))
}

const signUp = async ({ req, ResponseError }) => {
  const { body } = req
  const { fullName, email, password, Role } = body
  const generateToken = {
    code: getUniqueCodev2(10),
  }

  const tokenVerify = jwt.sign(
    JSON.parse(JSON.stringify(generateToken)),
    jwtPass,
    {
      expiresIn: 86400 * 1,
    }
  )

  const schema = yup.object().shape({
    fullName: yup.string().required('nama lengkap belum diisi'),
    email: yup
      .string()
      .email()
      .required('email belum diisi'),
    password: yup
      .string()
      .min(8, 'minimal 8 karakter')
      .required('password belum diisi'),
    Role: yup.string().required('role id belum diisi'),
  })

  await schema.validate(req.body)

  const insertData = await User.create({
    fullName,
    email,
    password,
    tokenVerify,
    Role,
  })

  // // data for email
  // const htmlTemplate = 'signUpTemplate'
  // const objData = {
  //   fullName,
  //   token: tokenVerify,
  // }
  // const optMail = {
  //   emailTo: email,
  //   subject: 'Verifikasi Email',
  // }
  // SendMailer(htmlTemplate, objData, optMail)

  return {
    message:
      'Kamu sudah berhasil mendaftar, silahkan check email untuk informasi selanjutnya!',
    insertData,
  }
}

const signIn = async ({ req, ResponseError }) => {
  const { body } = req
  const { email, password } = body

  const userData = await User.findOne({
    email,
  })
  if (!userData) {
    throw new ResponseError('Akun tidak ditemukan!', 404)
  }

  if (userData.active === true) {
    const checkPassword = await userData.comparePassword(password)
    if (checkPassword) {
      const token = jwt.sign(JSON.parse(JSON.stringify(userData)), jwtPass, {
        expiresIn: 86400 * 1,
      }) // 1 Days
      // create directory
      createDirectory(userData)

      return {
        token: `JWT ${token}`,
        uid: userData._id,
        rid: userData.Role._id,
      }
    }
    // console.log(res)
    throw new ResponseError('Email atau Password salah!', 401)
  } else {
    throw new ResponseError(
      'Please check your email account to verify your email and continue the registration process.',
      401
    )
  }
}

const changePass = async ({ req, ResponseError }) => {
  const { headers, body, params } = req
  const token = getToken(headers)
  const { currentPassword, password } = body
  const { id } = params

  if (token) {
    await validationRequest(body)

    const editData = await User.findById(id)
    if (!editData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }

    if (bcrypt.compareSync(currentPassword, editData.password)) {
      const hashPassword = bcrypt.hashSync(password, 10)
      await editData.updateOne({
        password: hashPassword,
      })
    } else {
      throw new ResponseError('Password lama kamu salah!', 400)
    }

    return {
      message: 'Data berhasil diperbarui!',
      editData,
    }
  }
  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

const getProfile = async ({ req, ResponseError }) => {
  const token = getToken(req.headers)
  if (token) {
    return jwt.decode(token)
  }
  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

const getAll = async ({ req, ResponseError }) => {
  const { query } = req
  // eslint-disable-next-line prefer-const
  let { page, pageSize, sorted, filtered } = query

  let filterObject = {}
  if (!page) page = 0
  if (!pageSize) pageSize = 100
  if (!sorted) sorted = 'desc'

  if (!invalidValues.includes(filtered)) {
    filterObject = convertQueryFilter(JSON.parse(filtered))
  }

  const data = await User.find(filterObject)
    .populate([{ path: 'Role' }])
    .limit(parseInt(pageSize))
    .skip(parseInt(pageSize) * parseInt(page))
    .sort({ createdAt: 'asc' })

  const total = await User.countDocuments()

  return {
    data,
    totalRow: total,
  }
}

const getOne = async ({ req, ResponseError }) => {
  const { id } = req.params
  const data = await User.findById(id).populate([{ path: 'Role' }])
  if (!data) {
    throw new ResponseError('Data tidak ditemukan!', 404)
  }
  return { data }
}

const storeData = async ({ req, ResponseError }) => {
  const { headers, body } = req
  const token = getToken(headers)
  const { fullName, email, password } = body

  if (token) {
    const schema = yup.object().shape({
      fullName: yup.string().required('nama lengkap belum diisi'),
      email: yup
        .string()
        .email()
        .required('email belum diisi'),
      password: yup
        .string()
        .min(8, 'minimal 8 karakter')
        .required('password belum diisi'),
      Role: yup.string().required('role id belum diisi'),
    })

    await schema.validate(body)

    const insertData = await User.create({
      fullName,
      email,
      password,
    })
    return {
      message: 'Data berhasil ditambahkan!',
      insertData,
    }
  }
  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

const updateData = async ({ req, ResponseError }) => {
  const { headers, body, params } = req
  const token = getToken(headers)
  const { fullName, email } = body
  const { id } = params

  if (token) {
    const editData = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
      },
      { new: true }
    )
    if (!editData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    return {
      message: 'Data berhasil diperbarui!',
      editData,
    }
  }
  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

const destroyData = async ({ req, ResponseError }) => {
  const { headers, params } = req
  const token = getToken(headers)
  const { id } = params

  if (token) {
    const deleteData = await User.findByIdAndRemove(id)
    if (!deleteData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    return {
      message: 'Data berhasil dihapus!',
    }
  }
  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

export {
  signUp,
  signIn,
  changePass,
  getProfile,
  getAll,
  getOne,
  storeData,
  updateData,
  destroyData,
}
