const Joi = require('@hapi/joi')
const Role = require('./role.model')
var Helper = require('../../helper/Common')

var getToken = Helper.getToken
const isValidationReplace = Helper.isValidationReplace

getAll = async (req, res) => {
  try {
    let data = await Role.find()
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

getOne = async (req, res) => {
  let id = req.params.id
  try {
    let data = await Role.findById(id)
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
  let { roleName } = req.body

  if (token) {
    try {
      const schema = Joi.object().keys({
        roleName: Joi.string().required()
      })

      await schema.validate(req.body)

      let insertData = await Role.create({
        roleName: roleName
      })
      return res.status(201).json({
        success: true,
        message: 'successfully added data!',
        insertData
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        message: isValidationReplace(err)
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
  let { roleName } = req.body
  let id = req.params.id

  if (token) {
    try {
      const schema = Joi.object().keys({
        roleName: Joi.string()
      })
      await schema.validate(req.body)

      let editData = await Role.findByIdAndUpdate(
        id,
        {
          roleName: roleName
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
      let deleteData = await Role.findByIdAndRemove(id)
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
  getAll,
  getOne,
  storeData,
  updateData,
  destroyData
}
