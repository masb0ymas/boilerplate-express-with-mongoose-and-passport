/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
import { Request } from 'express'
import models, { FilterQueryAttributes } from 'models'
import { filterQueryObject } from 'modules/MongoQuery/queryObject'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { RoleAttributes } from 'models/Role'
import schema from 'controllers/Role/schema'
import ExcelHelper from 'helpers/Excel'

const { Role } = models

class RoleService {
  /**
   *
   * @param req - Request
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

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   */
  public static async getOne(id: string) {
    const data = await Role.findById(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'role data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: RoleAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Role.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
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
   *
   * @param req - Request
   */
  public static async generateExcel(req: Request) {
    const { data } = await this.getAll(req)
    const roleData = JSON.parse(JSON.stringify(data))

    const header = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Name', key: 'name', width: 20 },
    ]

    const newData = []
    for (let i = 0; i < roleData.length; i += 1) {
      const item = roleData[i]
      newData.push({
        ...item,
      })
    }

    const stream: Buffer = await ExcelHelper.generate(header, newData)

    return stream
  }

  /**
   *
   * @param id
   */
  public static async delete(id: string) {
    await Role.findByIdAndRemove(id)
  }
}

export default RoleService
