import { log } from 'utils/logging'
import { hashPassword } from 'server/utils/password'

/**
 * Generate a password hash and salt
 */
export async function get(req, res) {
  log.info('Getting password XXXXX')
  if (!req.headers.password) {
    log.error('Failed to generate password', {
      error: 'No authorization headers',
    })

    res.setHeader('Content-Type', 'application/json')
    return res.end(
      JSON.stringify({
        generatedPasswordHashed: null,
        generatedSalt: null,
      })
    )
  }

  const password = Buffer.from(req.headers.password, 'base64').toString('ascii')

  const generatedSalt = await crypto.randomBytes(24).toString('hex')

  const generatedPasswordHashed = await hashPassword(password, generatedSalt)

  res.setHeader('Content-Type', 'application/json')
  res.end(
    JSON.stringify({
      generatedPasswordHashed,
      generatedSalt,
    })
  )
}

/**
 * Verify password using salt
 */
export async function post(req, res) {
  const { passwordInput, salt, userRecordPassword } = req.body

  try {
    if (!passwordInput || !salt || !userRecordPassword) {
      throw new Error('Missing data')
    }

    const passwordHashed = await hashPassword(passwordInput, salt)

    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        isVerified: passwordHashed === userRecordPassword,
      })
    )
  } catch (error) {
    log.error('Password verify', {
      error: error.message,
      hasPasswordInput: !!passwordInput,
      hasSalt: !!salt,
      hasUserRecordPassword: !!userRecordPassword,
    })

    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        isVerified: false,
      })
    )
  }
}
