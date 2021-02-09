/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
import { Request } from 'express'
import models, { FilterQueryAttributes } from 'models'
import { filterQueryObject } from 'modules/MongoQuery/queryObject'
import ResponseError from 'modules/Response/ResponseError'
import useValidation from 'helpers/useValidation'
import { setUserPassword, UserAttributes } from 'models/User'
import schema from 'controllers/User/schema'

const { User } = models
const populates = [{ path: 'Role' }]

class UserService {
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

    const data = await User.find(filterObject)
      .populate(populates)
      .select('-password -tokenVerify')
      .limit(Number(pageSize))
      .skip(Number(pageSize) * Number(page))
      .sort({ createdAt: 'asc' })

    const total = await User.countDocuments(filterObject)

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   */
  public static async getOne(id: string) {
    const data = await User.findById(id)
      .populate(populates)
      .populate([{ path: 'Role' }])
      .select('-password -tokenVerify')

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: UserAttributes) {
    const password = setUserPassword(formData)
    const newFormData = {
      ...formData,
      password,
    }
    const value = useValidation(schema.create, newFormData)
    const data = await User.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: UserAttributes) {
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
   * @param id
   */
  public static async delete(id: string) {
    await User.findByIdAndRemove(id)
  }
}

export default UserService
