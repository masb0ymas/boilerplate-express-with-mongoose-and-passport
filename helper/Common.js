getUniqueCode = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9)
}

function convertQueryFilter(filtered) {
  let resultObj = {}
  if (typeof filtered !== 'object') {
    throw new Error('Filtered must be an object, expected ' + typeof filtered)
  }

  for (let i = 0; i < filtered.length; i++) {
    let { id, value } = filtered[i]
    if (id.split('.').length > 1) {
      id = `$${id}$`
    }
    resultObj[id] = { $regex: '.*' + value + '.*' }
  }

  return resultObj
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
  isValidationReplace,
  convertQueryFilter
}
