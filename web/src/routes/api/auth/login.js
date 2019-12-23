import { query } from "svelte-apollo";
import { client } from '../_graphql'
import { GET_USER } from '../_graphql/_user'
import { serverLog } from '../../../utils/logging'
import { verifyPassword } from '../../../utils/auth'

export async function post(req, res) {
  try {
    const { email, password: passwordInput } = req.body

    serverLog.info(req, 'Login', { email })

    const userData = query(client, {
      fetchPolicy: 'no-cache',
      query: GET_USER,
      variables: { email }
    });

    const result = await userData.result();

    if (!result.data.user) {
      serverLog.info(req, 'User not found', { email })

      throw new Error('User not found')
    }

    const userRecord = result.data.user
    const isCorrectPassword = await verifyPassword(passwordInput, userRecord.password, userRecord.salt)

    if (!isCorrectPassword) {
      serverLog.info(req, 'Incorrect password', { email })

      throw new Error('Incorrect password')
    }

    // Only return email, id and hasPassword
    const { email: emailRecord, id } = userRecord
    const user = { email: emailRecord, hasPassword: true, id }

    serverLog.info(req, 'Successful login', { id }, id)

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