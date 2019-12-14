import * as yup from 'yup'
import Role from './role.model'
import { getToken, convertQueryFilter } from '../../helper'

const invalidValues = [undefined, null, '']

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

  const data = await Role.find(filterObject)
    .limit(parseInt(pageSize))
    .skip(parseInt(pageSize) * parseInt(page))
    .sort({ createdAt: 'asc' })

  const total = await Role.countDocuments()
  // response
  return {
    success: true,
    data: data,
    totalRow: total,
  }
}

const getOne = async ({ req, ResponseError }) => {
  const { params } = req
  let id = params.id
  let data = await Role.findById(id)
  if (!data) {
    throw new ResponseError('Data tidak ditemukan!', 404)
  }
  return { data }
}

const storeData = async ({ req, ResponseError }) => {
  const { headers, body } = req
  const token = getToken(headers)
  let { roleName } = body

  if (token) {
    let schema = yup.object().shape({
      roleName: yup.string().required('nama role belum diisi'),
    })

    await schema.validate(body)

    let insertData = await Role.create({
      roleName: roleName,
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
  let { roleName } = body
  let id = params.id

  if (token) {
    let schema = yup.object().shape({
      roleName: yup.string().required('nama role belum diisi'),
    })

    await schema.validate(body)

    let editData = await Role.findByIdAndUpdate(
      id,
      {
        roleName: roleName,
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
    let deleteData = await Role.findByIdAndRemove(id)
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

export { getAll, getOne, storeData, updateData, destroyData }
