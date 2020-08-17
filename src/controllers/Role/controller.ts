/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import asyncHandler from 'helpers/asyncHandler'
import routes, { AuthMiddleware } from 'routes/public'
import ServiceRole from './service'

routes.get(
  '/role',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { data, total } = await ServiceRole.getAll(req)

    return res.status(200).json({ data, total })
  })
)

routes.get(
  '/role/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const data = await ServiceRole.getOne(req)

    return res.status(200).json({ data })
  })
)

routes.post(
  '/role',
  AuthMiddleware,
  asyncHandler(async function createData(req: Request, res: Response) {
    const data = await ServiceRole.create(req)

    return res.status(201).json({ data })
  })
)

routes.put(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { message } = await ServiceRole.update(req)

    return res.status(200).json({ message })
  })
)

routes.delete(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { message } = await ServiceRole.delete(req)

    return res.status(200).json({ message })
  })
)
