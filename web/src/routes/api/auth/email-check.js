import { query } from "svelte-apollo";
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag";

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000'
  });

  return new ApolloClient({ link: httpLink, cache: new InMemoryCache() });
}

const client = createApolloClient();

const GET_USER = gql`
    query($email: String!) {
      user(email: $email) {
        email
      }
    }
  `;


export async function get(req, res, next) {
  const {
    email
  } = req.query

  const userData = query(client, {
    query: GET_USER,
    variables: { email }
  });

  const result = await userData.result();

  console.log(result.data.user)

  res.json({ emailStatus: result.data.user ? 'current' : 'new' })
}