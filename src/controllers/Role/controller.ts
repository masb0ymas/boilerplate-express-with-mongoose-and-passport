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

const { Role } = models

routes.get(
  '/role',
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

    const data = await Role.find(filterObject)
      .limit(Number(pageSize))
      .skip(Number(pageSize) * Number(page))
      .sort({ createdAt: 'asc' })

    const total = await Role.countDocuments(filterObject)

    return res.status(200).json({ data, total })
  })
)

routes.get(
  '/role/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await Role.findById(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return res.status(200).json({ data })
  })
)

routes.post(
  '/role',
  // AuthMiddleware,
  asyncHandler(async function createData(req: Request, res: Response) {
    const value = useValidation(schema.create, req.getBody())
    const data = await Role.create(value)

    return res.status(201).json({ data })
  })
)

routes.put(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await Role.findById(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    const value = useValidation(schema.create, {
      ...data.toJSON(),
      ...req.getBody(),
    })

    await data.update(value || {})

    return res.status(200).json({ data })
  })
)

routes.delete(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await Role.findByIdAndRemove(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return res.status(200).json({ message: 'Data berhasil dihapus!' })
  })
)
