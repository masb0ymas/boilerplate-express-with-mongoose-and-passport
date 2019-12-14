import 'dotenv/config'
import * as yup from 'yup'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from './user.model'
import SendMailer from '../../config/mail'
import { getToken, getUniqueCodev2, convertQueryFilter, validationRequest } from '../../helper'

const jwtPass = process.env.JWT_SECRET

const invalidValues = [undefined, null, '']

const signUp = async ({ req, ResponseError }) => {
  const { body } = req
  let { fullName, email, password, Role } = body
  let generateToken = {
    code: getUniqueCodev2(10),
  }

  let tokenVerify = jwt.sign(JSON.parse(JSON.stringify(generateToken)), jwtPass, {
    expiresIn: 86400 * 1,
  })

  let schema = yup.object().shape({
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

  let insertData = await User.create({
    fullName: fullName,
    email: email,
    password: password,
    tokenVerify: tokenVerify,
    Role: Role,
  })

  // data for email
  // const htmlTemplate = 'signUpTemplate'
  // let objData = {
  //   fullName: fullName,
  //   token: tokenVerify,
  // }
  // let optMail = {
  //   emailTo: email,
  //   subject: 'Verifikasi Email',
  // }
  // SendMailer(htmlTemplate, objData, optMail)

  return {
    success: true,
    message: 'Kamu sudah berhasil mendaftar, silahkan check email untuk informasi selanjutnya!',
    insertData,
  }
}

const signIn = async ({ req, ResponseError }) => {
  const { body } = req
  let { email, password } = body

  let userData = await User.findOne({
    email: email,
  })
  if (!userData) {
    throw new ResponseError('Akun tidak ditemukan!', 404)
  }

  if (userData.active === true) {
    let checkPassword = await userData.comparePassword(password)
    if (checkPassword) {
      let token = jwt.sign(JSON.parse(JSON.stringify(userData)), jwtPass, {
        expiresIn: 86400 * 1,
      }) // 1 Days
      return {
        success: true,
        token: 'JWT ' + token,
        uid: userData._id,
        rid: userData.Role._id,
      }
    } else {
      // console.log(res)
      throw new ResponseError('Email atau Password salah!', 401)
    }
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
  let { currentPassword, password } = body
  let id = params.id

  if (token) {
    await validationRequest(body)

    let editData = await User.findById(id)
    if (!editData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }

    if (bcrypt.compareSync(currentPassword, editData.password)) {
      let hashPassword = bcrypt.hashSync(password, 10)
      await editData.updateOne({
        password: hashPassword,
      })
    } else {
      throw new ResponseError('Password lama kamu salah!', 400)
    }

    return {
      success: true,
      message: 'Data berhasil diperbarui!',
      editData,
    }
  }
  throw new ResponseError(
    {
      success: false,
      message: 'Unauthorized. Please Re-login...',
    },
    403
  )
}

const getProfile = async ({ req, ResponseError }) => {
  const token = getToken(req.headers)
  if (token) {
    return jwt.decode(token)
  }
  throw new ResponseError(
    {
      success: false,
      message: 'Unauthorized. Please Re-login...',
    },
    403
  )
}

const getAll = async ({ req, ResponseError }) => {
  const { query } = req
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
    data: data,
    totalRow: total,
  }
}

const getOne = async ({ req, ResponseError }) => {
  let id = req.params.id
  let data = await User.findById(id).populate([{ path: 'Role' }])
  if (!data) {
    throw new ResponseError('Data tidak ditemukan!', 404)
  }
  return { data }
}

const storeData = async ({ req, ResponseError }) => {
  const { headers, body } = req
  const token = getToken(headers)
  let { fullName, email, password } = body

  if (token) {
    let schema = yup.object().shape({
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

    let insertData = await User.create({
      fullName: fullName,
      email: email,
      password: password,
    })
    return {
      success: true,
      message: 'Data berhasil ditambahkan!',
      insertData,
    }
  }
  throw new ResponseError(
    {
      success: false,
      message: 'Unauthorized. Please Re-login...',
    },
    403
  )
}

const updateData = async ({ req, ResponseError }) => {
  const { headers, body, params } = req
  const token = getToken(headers)
  let { fullName, email } = body
  let id = params.id

  if (token) {
    let editData = await User.findByIdAndUpdate(
      id,
      {
        fullName: fullName,
        email: email,
      },
      { new: true }
    )
    if (!editData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    return {
      success: true,
      message: 'Data berhasil diperbarui!',
      editData,
    }
  }
  throw new ResponseError(
    {
      success: false,
      message: 'Unauthorized. Please Re-login...',
    },
    403
  )
}

const destroyData = async ({ req, ResponseError }) => {
  const { headers, params } = req
  const token = getToken(headers)
  let id = params.id

  if (token) {
    let deleteData = await User.findByIdAndRemove(id)
    if (!deleteData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    return {
      success: true,
      message: 'Data berhasil dihapus!',
    }
  }
  throw new ResponseError(
    {
      success: false,
      message: 'Unauthorized. Please Re-login...',
    },
    403
  )
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
