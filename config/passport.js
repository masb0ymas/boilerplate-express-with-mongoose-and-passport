const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const User = require('../modules/User/user.model')

module.exports = function(passport) {
  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: 'SQiDap1djWTyIFoc4ffsXeHvgMq2', // pass jwt
  };
  passport.use('jwt', new JwtStrategy(jwtOpts, async function(jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload._id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
};
