const { createTestClient } = require('apollo-server-testing')
const gql = require('graphql-tag')
const nock = require('nock')

const { constructTestServer } = require('./__utils')

// the mocked SQL DataSource store
const { mockStore } = require('../datasources/__tests__/user')

describe('Queries', () => {})

describe('Mutations', () => {})
