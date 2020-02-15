import { generatePasswordHash, getUser, updateUser } from 'utils/auth'
import { log } from 'utils/logging'

export async function post(req, res) {
  const { passwordNew, passwordRetype, userId } = req.body

  await log.info('Begin password reset', {}, userId)

  let errors = []

  /**
   * Add to error array
   * @param {'notification' | 'password-new' | 'password-retype'} field Field to set
   * @param {string} message Error message
   */
  function setError(field, message) {
    errors = errors.concat({
      error: message,
      field,
    })
  }

  try {
    if (!passwordNew) {
      setError('password-new', 'Fill in this field')
    }

    if (!passwordRetype) {
      setError('password-retype', 'Fill in this field')
    }

    if (passwordNew !== passwordRetype) {
      setError('password-retype', 'Passwords do not match')
    }

    if (passwordNew.length < 8) {
      setError('password-new', 'Too short, should be at least 8 characters')
    }

    if (errors.length) {
      log.info(
        'Password reset form errors',
        {
          errors,
        },
        userId
      )

      throw new Error('Form validation errors')
    }

    const userRecord = await getUser({ id: parseInt(userId) })

    if (!userRecord.id) {
      setError(
        'notification',
        'Sorry but we could not reset the password at this time, please request a new reset link.'
      )

      throw new Error('No user')
    }

    if (!userRecord.passwordResetTime) {
      setError(
        'notification',
        'Sorry but we could not reset the password at this time, please request a new reset link.'
      )

      throw new Error('Password reset not requested')
    }

    const resetTime = parseInt(userRecord.passwordResetTime)

    if (isNaN(resetTime)) {
      setError(
        'notification',
        'Sorry but we could not reset the password at this time, please request a new reset link.'
      )

      throw new Error('Reset time incorrectly formed')
    }

    const elapsedMs = Date.now() - resetTime

    // Do not permit if greater than one hour (+ 30 mins buffer)
    if (elapsedMs / 1000 / 60 / 60 > 1.5) {
      setError(
        'notification',
        'Password has not been reset since the link has expired. Please request a new password reset link.'
      )

      throw new Error('Reset permission expired')
    }

    log.info('Password reset authorized', {}, userId)

    // Go ahead and reset password
    const {
      generatedPasswordHashed,
      generatedSalt,
    } = await generatePasswordHash(passwordNew)

    const { user: updatedUser, error } = await updateUser({
      id: parseInt(userId),
      password: generatedPasswordHashed,
      passwordResetTime: '',
      salt: generatedSalt,
    })

    if (updatedUser) {
      req.session.hasPassword = true

      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({}))
    } else {
      log.info('Password reset', { error: 'Could not update user' }, userId)

      throw new Error(error)
    }
  } catch (error) {
    log.info('Password reset', { error: error.message }, userId)

    res.setHeader('Content-Type', 'application/json')

    return res.end(
      JSON.stringify({
        errors,
      })
    )
  }
}
