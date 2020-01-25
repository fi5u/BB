import * as emailValidator from 'email-validator'
import { signUpUser } from '../../../utils/auth'
import { log } from '../../../utils/logging'

export async function post(req, res) {
  const { email, password } = req.body

  log.info('Signup', { email })

  let errors = []

  if (!emailValidator.validate(email)) {
    log.info('Invalid email', { email })

    errors = errors.concat({
      error: 'Invalid email',
      field: 'email',
    })
  }

  if (password.length < 8) {
    log.info('Too short password', { email, passwordLength: password.length })

    errors = errors.concat({
      error: 'Password should be at least 8 characters',
      field: 'password',
    })
  }

  if (errors.length) {
    res.setHeader('Content-Type', 'application/json')
    return res.end(
      JSON.stringify({
        errors,
        user: null,
      })
    )
  }

  const { error, user } = await signUpUser({ email, password })

  res.setHeader('Content-Type', 'application/json')

  if (user) {
    // Save user to session
    req.session.user = {
      ...user,
      hasPassword: true,
    }

    // Delete session values
    delete req.session.hasPassword
    delete req.session.savedEmail

    res.end(
      JSON.stringify({
        user,
      })
    )
  } else {
    log.error('Signup error, no user', { email, error })

    res.setHeader('Content-Type', 'application/json')

    res.end(
      JSON.stringify({
        user: null,
      })
    )
  }
}
