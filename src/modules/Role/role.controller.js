import * as yup from 'yup'
import Role from './role.model'
import { getToken, convertQueryFilter } from '#helpers'

const invalidValues = [undefined, null, '']

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

  const data = await Role.find(filterObject)
    .limit(parseInt(pageSize))
    .skip(parseInt(pageSize) * parseInt(page))
    .sort({ createdAt: 'asc' })

  const total = await Role.countDocuments()
  // response
  return {
    data,
    totalRow: total,
  }
}

const getOne = async ({ req, ResponseError }) => {
  const { params } = req
  const { id } = params
  const data = await Role.findById(id)
  if (!data) {
    throw new ResponseError('Data tidak ditemukan!', 404)
  }
  return { data }
}

const storeData = async ({ req, ResponseError }) => {
  const { headers, body } = req
  const token = getToken(headers)
  const { roleName } = body

  if (token) {
    const schema = yup.object().shape({
      roleName: yup.string().required('nama role belum diisi'),
    })

    await schema.validate(body)

    const insertData = await Role.create({
      roleName,
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
  const { roleName } = body
  const { id } = params

  if (token) {
    const schema = yup.object().shape({
      roleName: yup.string().required('nama role belum diisi'),
    })

    await schema.validate(body)

    const editData = await Role.findByIdAndUpdate(
      id,
      {
        roleName,
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
    const deleteData = await Role.findByIdAndRemove(id)
    if (!deleteData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    return {
      message: 'Data berhasil dihapus!',
    }
  }

  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

export { getAll, getOne, storeData, updateData, destroyData }
