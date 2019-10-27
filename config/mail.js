var nodemailer = require('nodemailer')
var handlebars = require('handlebars')
var path = require('path')
var fs = require('fs')

let credential = {
  email: 'your.smtp@domain.com',
  password: 'your-smtp-password'
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

// get read html file from config
SendMailer = (htmlTemplate, objData, optMail) => {
  readHTMLFile(
    path.resolve(__dirname, `../public/email_template/${htmlTemplate}.html`),
    (err, html) => {
      let template = handlebars.compile(html)
      let htmlToSend = template(objData)
      let mailOptions = {
        from: `No Reply <${credential.email}>`,
        to: `${optMail.emailTo}`,
        subject: `${optMail.subject}`,
        html: htmlToSend
      }
      // get transporter from config
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          console.log(err)
        } else {
          console.log('successfully', data)
        }
      })
    }
  )
}

module.exports = {
  SendMailer
}
