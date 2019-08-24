var nodemailer = require('nodemailer')
var fs = require('fs')

let credential = {
  email: 'example@mail.com',
  password: 'your password'
}

// service ( smtp, zoho, mailgun, and others )
let transport = {
  service: 'smtp',
  port: 587,
  secure: true,
  // ignoreTLS:true,
  // requireTLS:false,
  auth: {
    user: credential.email,
    pass: credential.password
  }
}

let transporter = nodemailer.createTransport(transport)

transporter.verify((err, success) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Server mail it`s ready!')
  }
})

readHTMLFile = async (path, callback) => {
  fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
    if (err) {
      throw err
      callback(err)
    } else {
      callback(null, html)
    }
  })
}

module.exports = {
  credential,
  transporter,
  readHTMLFile
}
