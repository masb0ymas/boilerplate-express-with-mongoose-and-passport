/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import models from 'models'
import { filterQueryObject } from 'helpers/Common'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { RoleAttributes } from 'models/Role'
import ResponseSuccess from 'modules/Response/ResponseSuccess'
import schema from './schema'

const { Role } = models

class RoleService {
  /**
   * Get All Role
   */
  public static async getAll(
    page: string | number,
    pageSize: string | number,
    filtered: string,
    sorted: string
  ) {
    if (!page) page = 0
    if (!pageSize) pageSize = 10
    const filterObject = filtered ? filterQueryObject(JSON.parse(filtered)) : {}

    const data = await Role.find(filterObject)
      .limit(Number(pageSize))
      .skip(Number(pageSize) * Number(page))
      .sort({ createdAt: 'asc' })

    const total = await Role.countDocuments(filterObject)

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   * Get One Role
   */
  public static async getOne(id: string) {
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
  public static async create(formData: RoleAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Role.create(value)

    return data
  }

  /**
   * Update Role By Id
   */
  public static async update(id: string, formData: RoleAttributes) {
    const data = await this.getOne(id)

    const value = useValidation(schema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.updateOne(value || {})

    return data
  }

  /**
   * Delete Role By Id
   */
  public static async delete(id: string) {
    await Role.findByIdAndRemove(id)

    return ResponseSuccess.deleted()
  }
}

export default RoleService
