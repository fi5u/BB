const { server } = require('../')
const gql = require('graphql-tag')

const { startTestServer, toPromise } = require('./__utils')

describe('Server - e2e', () => {
  let stop, graphql

  beforeEach(async () => {
    const testServer = await startTestServer(server)
    stop = testServer.stop
    graphql = testServer.graphql
  })

  afterEach(() => stop())
})
