import { Schema, model, Document } from 'mongoose'

export interface RoleAttributes {
  name: string
  createdAt?: Date
  updatedAt?: Date
}

interface RoleCreationAttributes extends RoleAttributes, Document {}

const RoleSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
)

const Role = model<RoleCreationAttributes>('Roles', RoleSchema)

export default Role
