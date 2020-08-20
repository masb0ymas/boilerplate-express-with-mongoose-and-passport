/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import asyncHandler from 'helpers/asyncHandler'
import routes, { AuthMiddleware } from 'routes/public'
import { FilterQueryAttributes } from 'models'
import RoleService from './service'

routes.get(
  '/role',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const {
      page,
      pageSize,
      filtered,
      sorted,
    }: FilterQueryAttributes = req.getQuery()
    const { data, total } = await RoleService.getAll(
      page,
      pageSize,
      filtered,
      sorted
    )

    return res.status(200).json({ data, total })
  })
)

routes.get(
  '/role/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await RoleService.getOne(id)

    return res.status(200).json({ data })
  })
)

routes.post(
  '/role',
  AuthMiddleware,
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()
    const { message, data } = await RoleService.create(formData)

    return res.status(201).json({ message, data })
  })
)

routes.put(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()
    const { message } = await RoleService.update(id, formData)

    return res.status(200).json({ message })
  })
)

routes.delete(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const { message } = await RoleService.delete(id)

    return res.status(200).json({ message })
  })
)
