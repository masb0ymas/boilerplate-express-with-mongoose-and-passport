/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import { verifyToken } from 'helpers/Token'
import { TokenAttributes } from 'models/User'
import Authorization from 'middlewares/Authorization'
import AuthService from './service'

routes.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const formData = req.getBody()
    const { data, message } = await AuthService.signUp(formData)

    return res.status(201).json({ data, message })
  })
)

routes.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    const formData = req.getBody()
    const { token, expiresIn, tokenType } = await AuthService.signIn(formData)

    return res.status(200).json({
      token,
      expiresIn,
      tokenType,
    })
  })
)

routes.get(
  '/profile',
  Authorization,
  asyncHandler(async function getProfile(req: Request, res: Response) {
    // @ts-ignore
    const token: TokenAttributes = verifyToken(req.getHeaders())
    const data = await AuthService.profile(token)

    return res.status(200).json({ data })
  })
)
