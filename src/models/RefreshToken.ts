import { Schema, model, Document } from 'mongoose'

export interface RefreshTokenAttributes {
  UserId: string
  token: string
  createdAt?: Date
  updatedAt?: Date
}

export interface verifyRefreshTokenAttributes {
  _id?: string
  name: string
  email: string
  active: boolean
}

interface RefreshTokenCreationAttributes
  extends RefreshTokenAttributes,
    Document {}

const RefreshTokenSchema = new Schema(
  {
    UserId: { type: Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
  },
  { timestamps: true }
)

const RefreshToken = model<RefreshTokenCreationAttributes>(
  'RefreshTokens',
  RefreshTokenSchema
)

export default RefreshToken
