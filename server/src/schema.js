const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    me: User
    user(email: String, fbId: String, id: Int): User
    users: [User]
  }

  type Mutation {
    addUser(
      email: String
      fbId: String
      name: String
      password: String
      salt: String
    ): User

    updateUser(
      email: String
      id: Int
      name: String
      password: String
      passwordResetTime: String
      salt: String
    ): User

    getUser(email: String, fbId: String): User
  }

  type User {
    email: String
    fbId: ID
    id: ID!
    name: String
    password: String
    passwordResetTime: String
    salt: String
  }
`

module.exports = typeDefs
