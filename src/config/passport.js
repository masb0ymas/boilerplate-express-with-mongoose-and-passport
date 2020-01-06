import 'dotenv/config'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

// load up the user model
const User = require('#modules/User/user.model')

module.exports = function(passport) {
  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.JWT_SECRET, // pass jwt
  }
  passport.use(
    'jwt',
    new JwtStrategy(jwtOpts, async function(jwtPayload, done) {
      try {
        const user = await User.findById(jwtPayload._id)
        if (!user) {
          return done(null, false)
        }
        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    })
  )
}
