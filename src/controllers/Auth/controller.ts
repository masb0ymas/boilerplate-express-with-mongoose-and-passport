/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import ServiceAuth from './service'

routes.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const { data, message } = await ServiceAuth.signUp(req)

    return res.status(201).json({ data, message })
  })
)

routes.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    await ServiceAuth.signIn(req, res)
  })
)

routes.get(
  '/profile',
  asyncHandler(async function getProfile(req: Request, res: Response) {
    await ServiceAuth.profile(req, res)
  })
)
