/* eslint-disable no-param-reassign */
const invalidValues = [undefined, null, '', false]

const getUniqueCode = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9)
}

const getUniqueCodev2 = (length = 32) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const convertQueryFilter = filtered => {
  const resultObj = {}
  if (typeof filtered !== 'object') {
    throw new Error(`Filtered must be an object, expected ${typeof filtered}`)
  }

  for (let i = 0; i < filtered.length; i += 1) {
    // eslint-disable-next-line prefer-const
    let { id, value } = filtered[i]
    if (id.split('.').length > 1) {
      id = `$${id}$`
    }
    resultObj[id] = { $regex: `.*${value}.*` }
  }

  return resultObj
}

const getToken = headers => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    }
    return null
  }
  return null
}

// validation with joi
const isValidationReplace = params => {
  for (let i = 0; i < params.details.length; i += 1) {
    const error = params.details[i]
    const msgError = error.message
    const pathError = error.path
    switch (error.type) {
      case 'number.base':
        params.details[i].message = msgError.replace(
          `"${pathError}" must be a number`,
          `${pathError} harus angka!`
        )
        break
      case 'any.empty':
        params.details[i].message = msgError.replace(
          `"${pathError}" is not allowed to be empty`,
          `${pathError} belum diisi!`
        )
        break
      case 'string.email':
        params.details[i].message = msgError.replace(
          `"${pathError}" must be a valid email`,
          `Gunakan ${pathError} yang valid!`
        )
        break
      default:
        params.details[i].message = msgError.replace(
          `"${pathError}" is not allowed to be empty`,
          `${pathError} belum diisi!`
        )
    }
  }
  return params
}

const validationRequest = async params => {
  const { currentPassword, password, Phone } = params

  if (!invalidValues.includes(password)) {
    const passwordStrongRegex = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)

    if (currentPassword === password) {
      throw new Error('Password baru tidak boleh sama dengan password lama!')
    }

    if (!passwordStrongRegex) {
      throw new Error(
        'Password harus ada 1 huruf kecil, 1 huruf besar, 1 angka, dan minimal 8 karakter'
      )
    }
  }

  if (!invalidValues.includes(Phone)) {
    // eslint-disable-next-line no-useless-escape
    const phoneRegex = Phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,10}$/)

    if (!phoneRegex) {
      throw new Error('Nomor telepon harus angka, dan minimal 10 digit, maksimal 15 digit!')
    }
  }
}

export {
  getUniqueCode,
  getUniqueCodev2,
  getToken,
  convertQueryFilter,
  isValidationReplace,
  validationRequest,
}
