import { query } from "svelte-apollo";
import { client } from '../_graphql'
import { GET_USER } from '../_graphql/_user'
import { log } from '../../../utils/logging'

export async function post(req, res) {
  try {
    const { email, password: passwordInput } = req.body

    log.info('Login', { email })

    const userData = query(client, {
      query: GET_USER,
      variables: { email }
    });

    const result = await userData.result();

    if (!result.data.user) {
      log.info('User not found', { email })

      throw new Error('User not found')
    }

    const userRecord = result.data.user

    const passwordHashed = await crypto
      .createHash("sha256")
      .update(passwordInput)
      .update(userRecord.salt)
      .digest("hex")

    const correctPassword = passwordHashed === userRecord.password;

    if (!correctPassword) {
      log.info('Incorrect password')

      throw new Error('Incorrect password')
    }

    // Only return email and id
    const { email: emailRecord, id } = userRecord
    const user = { email: emailRecord, id }

    log.info('Successful login', { id })

    // Save user to session
    req.session.user = user;

    // Delete saved email
    delete req.session.savedEmail;

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      user
    }));
  } catch (error) {
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