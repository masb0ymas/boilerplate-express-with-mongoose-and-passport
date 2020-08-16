// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express'

async function ExpressErrorMongoose(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.kind === 'ObjectId') {
    return res.status(404).json({
      message: 'Data tidak ditemukan atau sudah dihapus!',
    })
  }

  next(err)
}

export default ExpressErrorMongoose
