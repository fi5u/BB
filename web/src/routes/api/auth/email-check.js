import { query } from "svelte-apollo";
import { client } from '../_graphql'
import { GET_USER } from '../_graphql/_user'

export async function get(req, res, next) {
  const {
    email
  } = req.query

  const userData = query(client, {
    fetchPolicy: 'no-cache',
    query: GET_USER,
    variables: { email }
  });

  const result = await userData.result();

  console.log('result:')
  console.log(result)

  res.json({ emailStatus: result.data.user ? 'current' : 'new' })
}