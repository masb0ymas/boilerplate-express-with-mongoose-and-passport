/* eslint-disable no-unused-vars */
import { Schema, model, Document } from 'mongoose'

interface RoleAttributes {
  nama: string
  createdAt?: Date
  updatedAt?: Date
}

interface RoleCreationAttributes extends RoleAttributes, Document {}

const RoleSchema = new Schema(
  {
    roleName: { type: String, required: true },
  },
  { timestamps: true }
)

const Role = model<RoleCreationAttributes>('Role', RoleSchema)

export default Role
