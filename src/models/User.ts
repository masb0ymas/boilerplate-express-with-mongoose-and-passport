/* eslint-disable no-unused-vars */
import { Schema, model, Document } from 'mongoose'

export interface UserAttributes {
  fullName: string
  email: string
  password?: string | null
  phone: string
  active?: boolean | null
  tokenVerify?: string | null
  newPassword?: string
  confirmNewPassword?: string
  Role: string
  createdAt?: Date
  updatedAt?: Date
}

interface UserCreationAttributes extends UserAttributes, Document {}

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    active: { type: Boolean, default: false, required: true },
    tokenVerify: { type: String, required: true },
    Role: { type: Schema.Types.ObjectId, required: true, ref: 'Roles' },
  },
  { timestamps: true }
)

const User = model<UserCreationAttributes>('Users', UserSchema)

export default User
