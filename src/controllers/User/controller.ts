/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import models from 'models'
import { Request, Response } from 'express'
import useValidation from 'helpers/useValidation'
import asyncHandler from 'helpers/asyncHandler'
import { filterQueryObject, FilterQueryAttributes } from 'helpers/Common'
import routes, { AuthMiddleware } from 'routes/public'
import ResponseError from 'modules/ResponseError'
import schema from './schema'

const { User } = models

routes.get(
  '/user',
  asyncHandler(async function getAll(req: Request, res: Response) {
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
      .limit(Number(pageSize))
      .skip(Number(pageSize) * Number(page))
      .sort({ createdAt: 'asc' })

    const total = await User.countDocuments(filterObject)

    return res.status(200).json({ data, total })
  })
)

routes.get(
  '/user/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await User.findById(id).populate([{ path: 'Role' }])

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return res.status(200).json({ data })
  })
)

routes.post(
  '/user',
  AuthMiddleware,
  asyncHandler(async function createData(req: Request, res: Response) {
    const value = useValidation(schema.create, req.getBody())
    const data = await User.create(value)

    return res.status(201).json({ data })
  })
)

routes.put(
  '/user/:id',
  AuthMiddleware,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await User.findById(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    const value = useValidation(schema.create, {
      ...data.toJSON(),
      ...req.getBody(),
    })

    await data.updateOne(value || {})

    return res.status(200).json({ data })
  })
)

routes.delete(
  '/user/:id',
  AuthMiddleware,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await User.findByIdAndRemove(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return res.status(200).json({ message: 'Data berhasil dihapus!' })
  })
)
