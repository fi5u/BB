import { query } from "svelte-apollo";
import { client } from '../_graphql'
import { GET_USER } from '../_graphql/_user'

export async function get(req, res) {
  if (req.session.user) {
    return res.json({
      user: req.session.user,
    }).status(200).end()
  }

  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    console.log('No authorization headers')
    return res.end(JSON.stringify({
      user: null,
    }));
  }

  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  if (email && !password) {
    // Check for existance of email only

    const userData = query(client, {
      fetchPolicy: 'no-cache',
      query: GET_USER,
      variables: { email }
    });

    const result = await userData.result();

    // Note: do not save this user to session
    // This is simply a check

    res.setHeader('Content-Type', 'application/json');

    if (result && result.data && result.data.user) {
      return res.end(JSON.stringify({
        user: result.data.user
      }));
    }
  }

  res.end(JSON.stringify({
    user: null,
  }));
}