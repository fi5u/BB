import { mutate } from "svelte-apollo";
import { client } from '../../routes/api/_graphql'
import { ADD_USER } from '../../routes/api/_graphql/_user'
import * as argon2 from 'argon2'
import { randomBytes } from 'crypto'
import { generateJWT } from './jwt'


export async function signup(req, res) {
  const { email, password } = req.body

  console.log('signing up with')
  console.log(email, password)

  const { validateEmail } = await import(
    '../../utils/auth'
  )

  let errors = []

  const isEmailValid = await validateEmail(email)

  if (!isEmailValid) {
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
    return res.status(400).json({
      errors
    })
  }

  try {
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

      const token = generateJWT(userRecord)

      console.log('signed up:')
      console.log(userRecord)

      res.json({
        token,
        user: {
          email: userRecord.email,
        },
      }).status(200).end()
    } catch (error) {
      console.log('Error signing up')
      console.log(error.message)

      res.sendStatus(400)
    }
  } catch (bcryptError) {
    console.log('Hash error:')
    console.log(bcryptError.message)

    res.sendStatus(400)
  }
}
