import { serverLog as log } from 'utils/logging'
import { authenticate } from 'routes/api/auth/_utils/auth'
import * as jwt from 'jsonwebtoken'

export async function post(req, res) {
  const { email } = req.body

  log.info(req, 'Login', { email })

  authenticate.local(req, res, error => {
    const user = req.user

    user.hasPassword = true

    try {
      if (error || !user) {
        throw new Error(error || 'No user returned')
      }

      const { email, id } = user
      const tokenData = { email, id }

      const expiresSeconds = 60 * 2 // 5 mins

      const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: expiresSeconds,
      })

      log.info(req, 'Successful login', { id }, id)

      // Delete session values
      delete req.session.hasPassword
      delete req.session.savedEmail

      res.setHeader(
        'Set-Cookie',
        `access_token=${token}; Max-Age=${expiresSeconds}; HttpOnly; SameSite=Strict; Path=/${
          process.env.NODE_ENV !== 'development' ? '; Secure' : ''
        }`
      )

      res.setHeader('Content-Type', 'application/json')

      return res.end(
        JSON.stringify({
          user,
        })
      )
    } catch (error) {
      log.info(req, 'Error on login authentication', { error: error.message })

      res.setHeader('Content-Type', 'application/json')

      res.end(
        JSON.stringify({
          errors: [
            {
              error: error.message,
              field: 'password',
            },
          ],
          user: null,
        })
      )
    }
  })
}
