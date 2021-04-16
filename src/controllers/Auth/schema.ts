import * as yup from 'yup'

const register = yup
  .object()
  .shape({
    fullName: yup.string().required('Nama Lengkap wajib diisi'),
    email: yup
      .string()
      .email('Email tidak valid')
      .required('Email wajib diisi'),
    phone: yup.string().required('Phone wajib diisi'),
    active: yup.boolean().nullable(),
    tokenVerify: yup.string().nullable(),
    password: yup.string().nullable(),
    newPassword: yup
      .string()
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('confirmNewPassword')], 'Password tidak sama'),
    confirmNewPassword: yup
      .string()
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('newPassword')], 'Password tidak sama'),
    Role: yup.string().required('Role wajib diisi'),
  })
  .required()

const login = yup
  .object()
  .shape({
    email: yup
      .string()
      .email('Email tidak valid')
      .required('Email wajib diisi'),
    password: yup
      .string()
      .min(8, 'Minimal 8 karakter')
      .required('Password wajib diisi'),
  })
  .required()

const authSchema = { register, login }

export default authSchema
