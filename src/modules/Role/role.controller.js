import * as yup from 'yup'
import Role from './role.model'
import { getToken, convertQueryFilter } from '../../helper'

const invalidValues = [undefined, null, '']

const getAll = async (req, res) => {
  let { page, pageSize, sorted, filtered } = req.query

  try {
    let filterObject = {}
    if (!page) page = 0
    if (!pageSize) pageSize = 100
    if (!sorted) sorted = 'desc'

    if (!invalidValues.includes(filtered)) {
      filterObject = convertQueryFilter(JSON.parse(filtered))
    }

    await Role.find(filterObject)
      .limit(parseInt(pageSize))
      .skip(parseInt(pageSize) * parseInt(page))
      .sort({ createdAt: 'asc' })
      .exec(function(err, items) {
        Role.countDocuments().exec(function(err, count) {
          // response
          return res.status(200).json({
            success: true,
            data: items,
            totalRow: count,
          })
        })
      })
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err,
    })
  }
}

const getOne = async (req, res) => {
  let id = req.params.id
  try {
    let data = await Role.findById(id)
    if (!data) {
      return res.status(404).json({
        message: 'Data tidak ditemukan!',
      })
    }
    return res.status(200).json({
      success: true,
      data,
    })
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'Data tidak ditemukan!',
      })
    }
    return res.status(400).json({
      success: false,
      message: err,
    })
  }
}

const storeData = async (req, res) => {
  const token = getToken(req.headers)
  let { roleName } = req.body

  if (token) {
    try {
      let schema = yup.object().shape({
        roleName: yup.string().required('nama role belum diisi'),
      })

      await schema.validate(req.body)

      let insertData = await Role.create({
        roleName: roleName,
      })
      return res.status(201).json({
        success: true,
        message: 'Data berhasil ditambahkan!',
        insertData,
      })
    } catch (err) {
      // console.log(err)
      return res.status(400).json({
        success: false,
        message: err,
      })
    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Please Re-login...',
    })
  }
}

const updateData = async (req, res) => {
  const token = getToken(req.headers)
  let { roleName } = req.body
  let id = req.params.id

  if (token) {
    try {
      let schema = yup.object().shape({
        roleName: yup.string().required('nama role belum diisi'),
      })

      await schema.validate(req.body)

      let editData = await Role.findByIdAndUpdate(
        id,
        {
          roleName: roleName,
        },
        { new: true }
      )
      if (!editData) {
        return res.status(404).json({
          message: 'Data tidak ditemukan!',
        })
      }
      res.status(200).json({
        success: true,
        message: 'Data berhasil diperbarui!',
        editData,
      })
    } catch (err) {
      // console.log(err)
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          message: 'Data tidak ditemukan!',
        })
      }
      return res.status(400).json({
        success: false,
        message: err,
      })
    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Please Re-login...',
    })
  }
}

const destroyData = async (req, res) => {
  const token = getToken(req.headers)
  let id = req.params.id

  if (token) {
    try {
      let deleteData = await Role.findByIdAndRemove(id)
      if (!deleteData) {
        return res.status(404).json({
          message: 'Data tidak ditemukan!',
        })
      }
      res.status(200).json({
        success: true,
        message: 'Data berhasil dihapus!',
      })
    } catch (err) {
      // console.log(err)
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).json({
          message: 'Data tidak ditemukan!',
        })
      }
      return res.status(400).json({
        success: false,
        message: err,
      })
    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Please Re-login...',
    })
  }
}

export { getAll, getOne, storeData, updateData, destroyData }
