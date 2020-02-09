module.exports = {
  externalServices: {
    facebook: {
      appId: '565561970918201',
      version: 'v4.0',
    },
  },
  languages: {
    default: 'en-US',
    supported: [
      {
        code: 'en-GB',
        name: 'English (British)',
      },
      {
        code: 'en-US',
        name: 'English (US)',
      },
      {
        code: 'fi',
        name: 'Suomi',
      },
    ],
  },
  graphql: {
    url: 'http://localhost:4000',
  },
  service: {
    name: 'BB',
    url: 'http://localhost:3000',
  },
}
