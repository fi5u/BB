import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { graphql } from 'config'

import 'cross-fetch/polyfill'

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: graphql.url,
  })

  return new ApolloClient({ link: httpLink, cache: new InMemoryCache() })
}

export const client = createApolloClient()
