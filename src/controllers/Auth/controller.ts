/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import { currentToken, verifyToken } from 'helpers/Token'
import Authorization from 'middlewares/Authorization'
import ResponseSuccess from 'modules/Response/ResponseSuccess'
import AuthService from './service'

routes.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const formData = req.getBody()
    const { data, message } = await AuthService.signUp(formData)
    const buildResponse = ResponseSuccess.get(message)

    return res.status(201).json({ ...buildResponse, data })
  })
)

routes.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    const formData = req.getBody()
    const { token, expiresIn, tokenType } = await AuthService.signIn(formData)

    return res
      .cookie('token', token, {
        maxAge: Number(expiresIn) * 1000, // 7 Days
        httpOnly: true,
        path: '/v1',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ token, expiresIn, tokenType })
  })
)

routes.get(
  '/profile',
  Authorization,
  asyncHandler(async function getProfile(req: Request, res: Response) {
    const getToken = currentToken(req)
    const token = verifyToken(getToken)

    // @ts-ignore
    const data = await AuthService.profile(token)
    const buildResponse = ResponseSuccess.get()

    return res.status(200).json({ ...buildResponse, data })
  })
)
