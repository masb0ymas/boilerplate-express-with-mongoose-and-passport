/* eslint-disable no-unused-vars */
import { Schema, model, Document } from 'mongoose'

interface UserAttributes {
  nama: string
  createdAt?: Date
  updatedAt?: Date
}

interface UserCreationAttributes extends UserAttributes, Document {}

const UserSchema = new Schema(
  {
    nama: { type: String, required: true },
  },
  { timestamps: true }
)

const User = model<UserCreationAttributes>('Users', UserSchema)

export default User
