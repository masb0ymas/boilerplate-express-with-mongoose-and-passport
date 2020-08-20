/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import asyncHandler from 'helpers/asyncHandler'
import routes from 'routes/private'
import { FilterQueryAttributes } from 'models'
import UserService from './service'

routes.get(
  '/user',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const {
      page,
      pageSize,
      filtered,
      sorted,
    }: FilterQueryAttributes = req.getQuery()
    const { data, total } = await UserService.getAll(
      page,
      pageSize,
      filtered,
      sorted
    )

    return res.status(200).json({ data, total })
  })
)

routes.get(
  '/user/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await UserService.getOne(id)

    return res.status(200).json({ data })
  })
)

routes.post(
  '/user',
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await UserService.create(formData)

    return res.status(201).json({ data })
  })
)

routes.put(
  '/user/:id',
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()
    const { message } = await UserService.update(id, formData)

    return res.status(200).json({ message })
  })
)

routes.delete(
  '/user/:id',
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const { message } = await UserService.delete(id)

    return res.status(200).json({ message })
  })
)
