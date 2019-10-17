import { query } from "svelte-apollo";
import { client } from '../_graphql'
import { GET_USER } from '../_graphql/_user'
import * as argon2 from 'argon2'

export async function post(req, res) {
  try {
    const { email, password: passwordInput } = req.body

    const userData = query(client, {
      query: GET_USER,
      variables: { email }
    });

    const result = await userData.result();

    if (!result.data.user) {
      throw new Error('User not found')
    }

    const userRecord = result.data.user

    const correctPassword = await argon2.verify(userRecord.password, passwordInput);

    if (!correctPassword) {
      throw new Error('Incorrect password')
    }

    // Do not send typename or password back
    const { __typename, password, ...user } = userRecord

    console.log('logged in:')
    console.log(user)

    // Save user to session
    req.session.user = user;

    // Delete saved email
    delete req.session.savedEmail;

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      user
    }));
  } catch (error) {
    console.log('Login error')
    console.log(error)

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      errors: [{
        error: error.message,
        field: 'password'
      }],
      user: null,
    }));
  }
}