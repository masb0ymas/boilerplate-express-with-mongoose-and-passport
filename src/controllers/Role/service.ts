/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import models from 'models'
import { Request } from 'express'
import { filterQueryObject, FilterQueryAttributes } from 'helpers/Common'
import ResponseError from 'modules/ResponseError'
import useValidation from 'helpers/useValidation'
import schema from './schema'

const { Role } = models

class ServiceRole {
  /**
   * Get All Role
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

    const data = await Role.find(filterObject)
      .limit(Number(pageSize))
      .skip(Number(pageSize) * Number(page))
      .sort({ createdAt: 'asc' })

    const total = await Role.countDocuments(filterObject)

    return { data, total }
  }

  /**
   * Get One Role
   */
  public static async getOne(req: Request) {
    const { id } = req.getParams()
    const data = await Role.findById(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return data
  }

  /**
   * Create New Role
   */
  public static async create(req: Request) {
    const value = useValidation(schema.create, req.getBody())
    const data = await Role.create(value)

    return data
  }

  /**
   * Update Role By Id
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
   * Delete Role By Id
   */
  public static async delete(req: Request) {
    const { id } = req.getParams()
    const data = await Role.findByIdAndRemove(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return { message: 'Data berhasil dihapus!' }
  }
}

export default ServiceRole
