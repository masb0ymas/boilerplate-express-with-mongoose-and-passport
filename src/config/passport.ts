import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from 'models/User'

require('dotenv').config()

module.exports = function (passport: any) {
  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.JWT_SECRET, // pass jwt
  }
  passport.use(
    'jwt',
    new JwtStrategy(jwtOpts, async function (jwtPayload, done) {
      try {
        const user = await User.findById(jwtPayload.id)
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
