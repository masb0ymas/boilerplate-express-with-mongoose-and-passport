import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const SALT_WORK_FACTOR = 10

const UserSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    active: { type: Boolean, default: 0 },
    tokenVerify: { type: String, default: null },
    Role: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Role' },
  },
  { timestamps: true }
)

UserSchema.pre('save', function(next) {
  const user = this
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)
      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

module.exports = mongoose.model('User', UserSchema)
