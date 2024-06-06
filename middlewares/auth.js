
const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../schemas/userModel');
require('dotenv').config();

const secret = process.env.SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(new Error('User not found'), false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
        data: 'Unauthorized',
      });
    }
    
  
    if (user.token !== req.headers.authorization.split(' ')[1]) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
        data: 'Unauthorized',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = auth;
