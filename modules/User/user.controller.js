const Joi = require('@hapi/joi')
var jwt = require('jsonwebtoken')
const User = require('./user.model.js')
var Helper = require('../../helper/Common')
var path = require('path')
var handlebars = require('handlebars')
var mail = require('../../config/mail')

var getToken = Helper.getToken
var getUniqueCode = Helper.getUniqueCode
const isValidationReplace = Helper.isValidationReplace
const jwtPass = 'yourSecretPassword'

signUp = async (req, res) => {
  let { fullName, email, password } = req.body
  let generateToken = {
    code: getUniqueCode()
  }

  let tokenVerify = jwt.sign(JSON.parse(JSON.stringify(generateToken)), jwtPass, {
    expiresIn: 86400 * 1
  })

  try {
    const schema = Joi.object().keys({
      fullName: Joi.string().required(),
      email: Joi.string().email({ minDomainSegments: 2 }),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    })

    await schema.validate(req.body)

    let insertData = await User.create({
      fullName: fullName,
      email: email,
      password: password,
      active: 0,
      tokenVerify: tokenVerify
    })

    // get read html file from config
    mail.readHTMLFile(
      path.resolve(__dirname, '../public/email_template/SignUpTemplate.html'),
      (err, html) => {
        let template = handlebars.compile(html)
        let data = {
          fullName: penanggungJawab,
          email: email,
          password: generateToken.code,
          token: tokenVerify
        }
        let htmlToSend = template(data)
        let mailOptions = {
          from: `No Reply <${mail.credential.email}>`,
          to: `${email}`,
          subject: 'Subject Email',
          html: htmlToSend
        }
        // get transporter from config
        mail.transporter.sendMail(mailOptions, (err, data) => {
          if (err) {
            console.log(err)
          } else {
            console.log('successfully', data)
          }
        })
      }
    )

    return res.status(201).json({
      success: true,
      message: 'You have successfully registered',
      insertData
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      success: false,
      message: isValidationReplace(err)
    })
  }
}

signIn = async (req, res) => {
  let { email, password } = req.body

  try {
    let store = await User.findOne({
      email: email
    })
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Account not found!'
      })
    }

    store.comparePassword(password, (err, isMatch) => {
      if (isMatch && !err) {
        let token = jwt.sign(JSON.parse(JSON.stringify(store)), jwtPass, { expiresIn: 86400 * 30 }) // 30 Days
        jwt.verify(token, jwtPass, function(err, data) {
          // console.log(err, data);
        })
        return res.status(200).json({
          success: true,
          token: 'JWT ' + token,
          uid: store.id
        })
      } else {
        // console.log(res)
        res.status(401).json({
          success: false,
          message: 'Incorrect Email or Password!'
        })
      }
    })
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
  try {
    let getData = await User.find()
    return res.status(200).json({
      success: true,
      getData
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
    let getData = await User.findById(id)
    return res.status(200).json({
      success: true,
      getData
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
      const schema = Joi.object().keys({
        fullName: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2 }),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
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
  let id = req.params.id

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
