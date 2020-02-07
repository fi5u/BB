import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import bodyParser from 'body-parser'
import session from 'express-session'
import sessionFileStore from 'session-file-store'
import * as sapper from '@sapper/server'
import * as crypto from 'crypto'

import { log } from './server/endpoints/logging'

import { routeLog } from './server/middlewares/route-logging'
import { determineLang, registerLang } from './server/middlewares/i18n'

import { config } from 'dotenv'
config()

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const FileStore = sessionFileStore(session)

global.crypto = crypto // TODO: do we need this?

const app = polka()

// Set up i18n
app.use(determineLang)
app.use(registerLang)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 31536000,
    },
    store: new FileStore({
      path: process.env.NOW ? `/tmp/sessions` : `.sessions`,
    }),
  })
)

app.use(routeLog)

app.post('/api/logging', log)

app.use(
  compression({ threshold: 0 }),
  sirv('static', { dev }),
  sapper.middleware({
    session: req => ({
      hasFBLogin: req.session && req.session.hasFBLogin,
      hasPassword: req.session && req.session.hasPassword,
      savedEmail: req.session && req.session.savedEmail,
      user: req.session && req.session.user,
    }),
  })
)

app.listen(PORT, err => {
  if (err) {
    console.log('error', err)
  } else {
    console.log(`Listening on ${PORT}`)
  }
})
