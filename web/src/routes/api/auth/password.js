import { log } from '../../../utils/logging'

/**
 * Generate a password hash and salt
 */
export async function get(req, res) {
  if (!req.headers.password) {
    log.error('Generate password', {
      error: 'No authorization headers',
    })

    return res.end(
      JSON.stringify({
        generatedPasswordHashed: null,
        generatedSalt: null,
      })
    )
  }

  const password = Buffer.from(req.headers.password, 'base64').toString('ascii')

  const generatedSalt = await crypto.randomBytes(24).toString('hex')

  const generatedPasswordHashed = await crypto
    .createHash('sha256')
    .update(password)
    .update(generatedSalt)
    .digest('hex')

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
      throw new Error('Password verify - missing data')
    }

    const passwordHashed = await crypto
      .createHash('sha256')
      .update(passwordInput)
      .update(salt)
      .digest('hex')

    res.end(
      JSON.stringify({
        isVerified: passwordHashed === userRecordPassword,
      })
    )
  } catch (error) {
    log.error('Password verify', {
      error: error.message,
    })

    res.end(
      JSON.stringify({
        isVerified: false,
      })
    )
  }
}
