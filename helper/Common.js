getUniqueCode = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9)
}

getToken = headers => {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    } else {
      return null
    }
  } else {
    return null
  }
}

isValidationReplace = params => {
  for (let i = 0; i < params.details.length; i++) {
    let error = params.details[i]
    let msgError = error.message
    let pathError = error.path
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

module.exports = {
  getUniqueCode,
  getToken,
  isValidationReplace
}
