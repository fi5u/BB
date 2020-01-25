import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import 'cross-fetch/polyfill'

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000',
  })

  return new ApolloClient({ link: httpLink, cache: new InMemoryCache() })
}

export const client = createApolloClient()
