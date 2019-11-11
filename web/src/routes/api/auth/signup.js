import * as emailValidator from 'email-validator'
import { signUpUser } from '../../../utils/auth'

export async function post(req, res) {
  const { email, password } = req.body

  console.log('signing up with')
  console.log(email, password)

  let errors = []

  if (!emailValidator.validate(email)) {
    errors = errors.concat({
      error: 'Invalid email',
      field: 'email',
    })
  }

  if (password.length < 8) {
    errors = errors.concat({
      error: 'Password should be at least 8 characters',
      field: 'password',
    })
  }

  if (errors.length) {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      errors,
      user: null,
    }));
  }

  const { error, user } = await signUpUser({ email, password })

  res.setHeader('Content-Type', 'application/json');

  if (user) {
    // Save user to session
    req.session.user = user;

    // Delete saved email
    delete req.session.savedEmail;

    res.end(JSON.stringify({
      user,
    }));
  } else {
    console.log('Error signing up')
    console.log(error)

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      user: null,
    }));
  }
}