import { query } from "svelte-apollo";
import { client } from '../../routes/api/_graphql'
import { GET_USER_BY_ID } from '../../routes/api/_graphql/_user'

export default async (req, res, next) => {
  try {
    const decodedUser = req.token.data;

    const user = query(client, {
      query: GET_USER_BY_ID,
      variables: { id: decodedUser.id }
    });

    if (!user) {
      res.status(401).end();
    }

    req.currentUser = user;

    return next();
  } catch (e) {
    return res.json(e).status(500);
  }
}