import * as passport from 'passport'

const authenticate = {
  jwt: passport.authenticate('jwt', { session: false }),
  local: passport.authenticate('local', { session: false }),
}

export { authenticate }
