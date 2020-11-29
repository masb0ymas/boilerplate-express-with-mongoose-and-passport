import Role from 'models/Role'
import User from 'models/User'
import RefreshToken from 'models/RefreshToken'

export interface FilterAttributes {
  id: string
  value: string
}

export interface SortAttributes {
  id: string
  desc: string
}

export interface FilterQueryAttributes {
  page: string | number
  pageSize: string | number
  filtered: string
  sorted: string
}

export default {
  Role,
  User,
  RefreshToken,
}
