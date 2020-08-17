/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import asyncHandler from 'helpers/asyncHandler'
import routes from 'routes/private'
import ServiceUser from './service'

routes.get(
  '/user',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { data, total } = await ServiceUser.getAll(req)

    return res.status(200).json({ data, total })
  })
)

routes.get(
  '/user/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const data = await ServiceUser.getOne(req)

    return res.status(200).json({ data })
  })
)

routes.post(
  '/user',
  asyncHandler(async function createData(req: Request, res: Response) {
    const data = await ServiceUser.create(req)

    return res.status(201).json({ data })
  })
)

routes.put(
  '/user/:id',
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { message } = await ServiceUser.update(req)

    return res.status(200).json({ message })
  })
)

routes.delete(
  '/user/:id',
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { message } = await ServiceUser.delete(req)

    return res.status(200).json({ message })
  })
)
