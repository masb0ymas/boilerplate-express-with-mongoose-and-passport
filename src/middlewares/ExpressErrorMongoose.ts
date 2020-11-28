import { NextFunction, Request, Response } from 'express'

async function ExpressErrorMongoose(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.kind === 'ObjectId') {
    return res.status(404).json({
      code: 404,
      message: 'data not found or has been deleted!',
    })
  }

  next(err)
}

export default ExpressErrorMongoose
