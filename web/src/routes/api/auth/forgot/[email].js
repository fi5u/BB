import * as emailValidator from 'email-validator'
import { log } from '../../../../utils/logging'
import { send } from '../../_email/send-email'
import { getUser, updateUser } from '../../../../utils/auth'

/**
 * Request a password reset link
 */
export async function get(req, res) {
  try {
    const { email: encodedEmail } = req.params

    if (!encodedEmail) {
      log.info('Password reset request')

      throw new Error('No email passed')
    }

    const email = decodeURIComponent(encodedEmail)

    log.info('Password reset request', { email })

    let errors = []

    if (!emailValidator.validate(email)) {
      errors = errors.concat({
        error: 'Invalid email',
        field: 'email',
      })
    }

    if (errors.length) {
      log.info('Password reset request form errors', {
        errors,
        email,
      })

      res.setHeader('Content-Type', 'application/json')

      return res.end(
        JSON.stringify({
          errors,
        })
      )
    }

    const userRecord = await getUser({ email })

    if (userRecord.id) {
      // Set reset time in db
      // Needs to be saved as string, as is too large for int
      const passwordResetTime = Date.now().toString()
      await updateUser({ id: parseInt(userRecord.id), passwordResetTime })

      const resetId = Buffer.from(`id${userRecord.id}`).toString('base64')

      // Send email
      send({
        subject: 'BB – password reset link',
        text: `You requested a password reset link. Please visit the following link to reset your password: http://localhost:3000/continue/reset/${resetId}. This link will expire in 1 hour.`,
        to: userRecord.email,
      })
    } else {
      log.info('Password reset user not registered')
    }

    res.end(JSON.stringify({}))
  } catch (error) {
    log.error('Forgot password', { error: error.message })

    res.end(JSON.stringify({}))
  }
}
