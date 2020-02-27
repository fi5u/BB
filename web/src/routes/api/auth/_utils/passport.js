import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { log } from 'utils/logging'
import { config } from 'dotenv'

config()

const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },

    async (username, pass, done) => {
      log.info('Login authentication', { email: username })

      const [{ getUser }, { hashPassword }] = await Promise.all([
        import('utils/auth'),
        import('server/utils/password'),
      ])

      try {
        const userRecord = await getUser({ email: username })
        if (!userRecord) {
          log.info('User not found', { email: username })

          return done(null, false)
        }

        const hashedPassword = await hashPassword(pass, userRecord.salt)
        if (userRecord.password !== hashedPassword) {
          log.info('Incorrect password', { email: username })

          return done(null, false)
        }

        const { password, salt, ...user } = userRecord

        log.info('Login authorized', { email: username }, user.id)

        return done(null, user)
      } catch (error) {
        log.info('Failed to log in', { email: username, error: error.message })

        return done(error.message)
      }
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, cb) => {
      console.log('JWT strategy')
      const { getUser } = await import('utils/auth')
      const { id } = jwtPayload
      try {
        const userRecord = await getUser({ id })
        if (userRecord) {
          const { password, salt, ...user } = userRecord
          console.log('Returning user:')
          console.log(user)

          return cb(null, user)
        }

        throw new Error('JWT no user record found')
      } catch (error) {
        console.log('Jwt error:')
        console.log(error)
        return cb(error)
      }
    }
  )
)
