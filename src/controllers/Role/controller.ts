/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import asyncHandler from 'helpers/asyncHandler'
import routes from 'routes/public'
import { FilterQueryAttributes } from 'models'
import Authorization from 'middlewares/Authorization'
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
  Authorization,
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()
    const { message, data } = await RoleService.create(formData)

    return res.status(201).json({ message, data })
  })
)

routes.put(
  '/role/:id',
  Authorization,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()
    const { message } = await RoleService.update(id, formData)

    return res.status(200).json({ message })
  })
)

routes.delete(
  '/role/:id',
  Authorization,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const { message } = await RoleService.delete(id)

    return res.status(200).json({ message })
  })
)
