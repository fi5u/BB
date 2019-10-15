import { query } from "svelte-apollo";
import { client } from '../_graphql'
import { GET_USER } from '../_graphql/_user'
import * as argon2 from 'argon2'

export async function post(req, res) {
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

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      user: {
        email,
      }
    }));
  } catch (error) {
    console.log('Login error')
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      user: null,
    }));
  }
}