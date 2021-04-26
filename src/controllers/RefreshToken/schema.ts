import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    UserId: yup.string().required('UserId wajib diisi'),
    token: yup.string().required('Token wajib diisi'),
  })
  .required()

const refreshTokenSchema = {
  create,
}

export default refreshTokenSchema
