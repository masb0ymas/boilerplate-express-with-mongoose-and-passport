let yup = require('yup')
var jwt = require('jsonwebtoken')
const User = require('./user.model.js')
var Helper = require('../../helper/Common')
var mail = require('../../config/mail')

var getToken = Helper.getToken
var getUniqueCode = Helper.getUniqueCode
var convertQueryFilter = Helper.convertQueryFilter
const jwtPass = 'yourSecretPassword'

const invalidValues = [undefined, null, '']

signUp = async (req, res) => {
  let { fullName, email, password, RoleId } = req.body
  let generateToken = {
    code: getUniqueCode()
  }

  let tokenVerify = jwt.sign(JSON.parse(JSON.stringify(generateToken)), jwtPass, {
    expiresIn: 86400 * 1
  })

  try {
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
      RoleId: yup.string().required('role id belum diisi')
    })

    await schema.validate(req.body)

    let insertData = await User.create({
      fullName: fullName,
      email: email,
      password: password,
      tokenVerify: tokenVerify,
      RoleId: RoleId
    })

    // data for email
    const htmlTemplate = 'signUpTemplate'
    let objData = {
      fullName: fullName,
      token: tokenVerify
    }
    let optMail = {
      emailTo: email,
      subject: 'Verifikasi Email'
    }
    mail.SendMailer(htmlTemplate, objData, optMail)

    return res.status(201).json({
      success: true,
      message: 'You have successfully registered',
      insertData
    })
  } catch (err) {
    // console.log(err)
    return res.status(400).json({
      success: false,
      message: err
    })
  }
}

signIn = async (req, res) => {
  let { email, password } = req.body

  try {
    let userData = await User.findOne({
      email: email
    })
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'Account not found!'
      })
    }

    if (userData.active === true) {
      userData.comparePassword(password, (err, isMatch) => {
        if (isMatch && !err) {
          let token = jwt.sign(JSON.parse(JSON.stringify(userData)), jwtPass, {
            expiresIn: 86400 * 1
          }) // 1 Days

          return res.status(200).json({
            success: true,
            token: 'JWT ' + token,
            uid: userData.id,
            rid: userData.RoleId._id
          })
        } else {
          // console.log(res)
          res.status(401).json({
            success: false,
            message: 'Incorrect Email or Password!'
          })
        }
      })
    } else {
      res.status(401).json({
        success: false,
        message:
          'Please check your email account to verify your email and continue the registration process.'
      })
    }
  } catch (err) {
    return res.status(400).json(err.errors)
  }
}

getProfile = async (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    res.status(200).json(jwt.decode(token))
  } else {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Please Re-login...'
    })
  }
}

getAll = async (req, res) => {
  let { page, pageSize, sorted, filtered } = req.query

  try {
    let filterObject = {}
    if (!page) page = 0
    if (!pageSize) pageSize = 100
    if (!sorted) sorted = 'desc'

    if (!invalidValues.includes(filtered)) {
      filterObject = convertQueryFilter(JSON.parse(filtered))
    }

    await User.find(filterObject)
      .populate('RoleId')
      .limit(parseInt(pageSize))
      .skip(parseInt(pageSize) * parseInt(page))
      .sort({ createdAt: 'asc' })
      .exec(function(err, items) {
        User.countDocuments().exec(function(err, count) {
          // response
          return res.status(200).json({
            success: true,
            data: items,
            totalRow: count
          })
        })
      })
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err
    })
  }
}

getOne = async (req, res) => {
  let id = req.params.id
  try {
    let data = await User.findById(id).populate('RoleId')
    return res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err
    })
  }
}

storeData = async (req, res) => {
  const token = getToken(req.headers)
  let { fullName, email, password } = req.body

  if (token) {
    try {
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
        RoleId: yup.string().required('role id belum diisi')
      })

      await schema.validate(req.body)

      let insertData = await User.create({
        fullName: fullName,
        email: email,
        password: password
      })
      return res.status(201).json({
        success: true,
        message: 'successfully added data',
        insertData
      })
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err
      })
    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Please Re-login...'
    })
  }
}

updateData = async (req, res) => {
  const token = getToken(req.headers)
  let { fullName, email } = req.body
  let id = req.params.id

  if (token) {
    try {
      let editData = await User.findByIdAndUpdate(
        id,
        {
          fullName: fullName,
          email: email
        },
        { new: true }
      )
      if (!editData) {
        return res.status(404).json({
          message: 'data not found!'
        })
      }
      res.status(200).json({
        success: true,
        message: 'data updated successfully!',
        editData
      })
    } catch (err) {
      // console.log(err)
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          message: 'data not found!'
        })
      }
      return res.status(400).json({
        success: false,
        message: err
      })
    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Please Re-login...'
    })
  }
}

destroyData = async (req, res) => {
  const token = getToken(req.headers)
  let id = req.params.id

  if (token) {
    try {
      let deleteData = await User.findByIdAndRemove(id)
      if (!deleteData) {
        return res.status(404).json({
          message: 'data not found!'
        })
      }
      res.status(200).json({
        success: true,
        message: 'data successfully deleted!'
      })
    } catch (err) {
      // console.log(err)
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).json({
          message: 'data not found!'
        })
      }
      return res.status(400).json({
        success: false,
        message: err
      })
    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Please Re-login...'
    })
  }
}

module.exports = {
  signUp,
  signIn,
  getProfile,
  getAll,
  getOne,
  storeData,
  updateData,
  destroyData
}
