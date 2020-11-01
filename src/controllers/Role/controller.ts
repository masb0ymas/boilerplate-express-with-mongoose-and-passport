/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import asyncHandler from 'helpers/asyncHandler'
import routes from 'routes/public'
import { FilterQueryAttributes } from 'models'
import Authorization from 'middlewares/Authorization'
import ResponseSuccess from 'modules/Response/ResponseSuccess'
import RoleService from './service'

routes.get(
  '/role',
  Authorization,
  asyncHandler(async function getAll(req: Request, res: Response) {
    const {
      page,
      pageSize,
      filtered,
      sorted,
    }: FilterQueryAttributes = req.getQuery()
    const { message, data, total } = await RoleService.getAll(
      page,
      pageSize,
      filtered,
      sorted
    )
    const buildResponse = ResponseSuccess.get(message)

    return res.status(200).json({ ...buildResponse, data, total })
  })
)

routes.get(
  '/role/:id',
  Authorization,
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await RoleService.getOne(id)
    const buildResponse = ResponseSuccess.get()

    return res.status(200).json({ ...buildResponse, data })
  })
)

routes.post(
  '/role',
  Authorization,
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await RoleService.create(formData)
    const buildResponse = ResponseSuccess.created()

    return res.status(201).json({ ...buildResponse, data })
  })
)

routes.put(
  '/role/:id',
  Authorization,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await RoleService.update(id, formData)
    const buildResponse = ResponseSuccess.updated()

    return res.status(200).json({ ...buildResponse, data })
  })
)

routes.delete(
  '/role/:id',
  Authorization,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const { code, message } = await RoleService.delete(id)

    return res.status(200).json({ code, message })
  })
)
