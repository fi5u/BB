import * as jwt from 'jsonwebtoken'
import { serverLog as log } from 'utils/logging'

export async function get(req, res) {
  try {
    log.info(req, 'Authenticating')

    if (!req.cookies || !req.cookies.access_token) {
      log.warn(
        req,
        req.cookies ? 'No access token passed' : 'No cookies passed'
      )

      throw new Error()
    }

    const { email, id } = await jwt.verify(
      req.cookies.access_token,
      process.env.JWT_SECRET
    )

    let user = { email, id }

    if (req.query && req.query.fulluser) {
      const { getUser } = await import('utils/auth')

      const userRecord = await getUser({ id: parseInt(id) })

      const { password, salt, ...redactedUser } = userRecord

      user = redactedUser
      user.hasPassword = !!password
    }

    log.info(req, 'Authenticated', { id }, id)

    res.setHeader('Content-Type', 'application/json')

    return res.end(
      JSON.stringify({
        user,
      })
    )
  } catch (error) {
    log.info(req, 'Not authenticated', { error: error.message })

    res.setHeader('Content-Type', 'application/json')

    return res.end(
      JSON.stringify({
        user: null,
      })
    )
  }
}
