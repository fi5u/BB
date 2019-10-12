import { query } from "svelte-apollo";
import { client } from '../../routes/api/_graphql'
import { GET_USER } from '../../routes/api/_graphql/_user'
import * as argon2 from 'argon2'
import { generateJWT } from './jwt'

export async function login(req, res) {
  const { email, password } = req.body

  try {
    const userData = query(client, {
      query: GET_USER,
      variables: { email }
    });

    const result = await userData.result();

    if (!result.data.user) {
      throw new Error('User not found')
    }

    const userRecord = result.data.user
    const correctPassword = await argon2.verify(password, userRecord.password);

    if (!correctPassword) {
      throw new Error('Incorrect password')
    }

    return res.status(200).json({
      user: {
        email,
      }, token: generateJWT(userRecord)
    }).end();
  } catch (error) {
    console.log('Login error')
    return done(error)
  }
}
