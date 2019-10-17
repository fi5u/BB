import { mutate } from "svelte-apollo";
import { client } from '../_graphql'
import { ADD_USER } from '../_graphql/_user'
import * as argon2 from 'argon2'
import { randomBytes } from 'crypto'
import * as emailValidator from 'email-validator'

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

  const salt = randomBytes(32);
  const passwordHashed = await argon2.hash(password, { salt });

  try {
    const userRecord = await mutate(client, {
      mutation: ADD_USER,
      variables: {
        email,
        password: passwordHashed,
        salt: salt.toString('hex'),
      }
    });

    // Do not send typename back
    const { __typename, ...user } = userRecord.data.addUser

    console.log('signed up:')
    console.log(user)

    // Save user to session
    req.session.user = user;

    // Delete saved email
    delete req.session.savedEmail;

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      user,
    }));
  } catch (error) {
    console.log('Error signing up')
    console.log(error.message)

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      user: null,
    }));
  }
}