import { Schema, model, Document } from 'mongoose'

export interface RoleAttributes {
  nama: string
  createdAt?: Date
  updatedAt?: Date
}

interface RoleCreationAttributes extends RoleAttributes, Document {}

const RoleSchema = new Schema(
  {
    nama: { type: String, required: true },
  },
  { timestamps: true }
)

const Role = model<RoleCreationAttributes>('Roles', RoleSchema)

export default Role
