import { query } from "svelte-apollo";
import { client } from '../_graphql'
import { GET_USER } from '../_graphql/_user'

export async function get(req, res) {
  if (req.session.user) {
    return res.json({
      user: req.session.user,
    }).status(200).end()
  }

  // TODO: base64 encode email and password and pass in
  // Authorization header https://stackoverflow.com/a/36822785/997596

  const { email, password } = req.query

  if (email && !password) {
    // Check for existance of email only

    const userData = query(client, {
      fetchPolicy: 'no-cache',
      query: GET_USER,
      variables: { email }
    });

    const result = await userData.result();

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