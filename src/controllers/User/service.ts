/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import models from 'models'
import { Request } from 'express'
import { filterQueryObject, FilterQueryAttributes } from 'helpers/Common'
import ResponseError from 'modules/ResponseError'
import useValidation from 'helpers/useValidation'
import { setUserPassword } from 'models/User'
import schema from './schema'

const { User } = models

class ServiceUser {
  /**
   * Get All User
   */
  public static async getAll(req: Request) {
    let {
      page,
      pageSize,
      filtered,
      sorted,
    }: FilterQueryAttributes = req.getQuery()

    if (!page) page = 0
    if (!pageSize) pageSize = 10
    const filterObject = filtered ? filterQueryObject(JSON.parse(filtered)) : {}

    const data = await User.find(filterObject)
      .populate([{ path: 'Role' }])
      .select('-password -tokenVerify')
      .limit(Number(pageSize))
      .skip(Number(pageSize) * Number(page))
      .sort({ createdAt: 'asc' })

    const total = await User.countDocuments(filterObject)

    return { data, total }
  }

  /**
   * Get One User
   */
  public static async getOne(req: Request) {
    const { id } = req.getParams()
    const data = await User.findById(id)
      .populate([{ path: 'Role' }])
      .select('-password -tokenVerify')

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return data
  }

  /**
   * Create New User
   */
  public static async create(req: Request) {
    const password = setUserPassword(req.getBody())
    req.setBody({ password })
    const value = useValidation(schema.create, req.getBody())
    const data = await User.create(value)

    return data
  }

  /**
   * Update User By Id
   */
  public static async update(req: Request) {
    const data = await this.getOne(req)

    const value = useValidation(schema.create, {
      ...data.toJSON(),
      ...req.getBody(),
    })

    await data.updateOne(value || {})

    return { message: 'Data sudah diperbarui!' }
  }

  /**
   * Delete User By Id
   */
  public static async delete(req: Request) {
    const { id } = req.getParams()
    const data = await User.findByIdAndRemove(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return { message: 'Data berhasil dihapus!' }
  }
}

export default ServiceUser
