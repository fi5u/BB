import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import sessionFileStore from 'session-file-store'
import * as sapper from '@sapper/server'
import * as crypto from 'crypto'

import { session as sessionConfig } from 'config'
import { log } from 'server/endpoints/logging'
import { routeLog } from 'server/middlewares/route-logging'
import { determineLang, registerLang } from 'server/middlewares/i18n'

import { config } from 'dotenv'
config()

import 'routes/api/auth/_utils/passport'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const FileStore = sessionFileStore(session)

global.crypto = crypto // TODO: do we need this?

const app = polka()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
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

// Set up i18n
app.use(determineLang)
app.use(registerLang)

// Log routes
app.use(routeLog)

app.post('/api/logging', log) // TODO: move this to api dir

app.use(
  compression({ threshold: 0 }),
  sirv('static', { dev }),
  sapper.middleware({
    session: req =>
      sessionConfig.ids.reduce((sessionObject, id) => {
        return {
          ...sessionObject,
          [id]: req.session && req.session[id],
        }
      }, {}),
  })
)

app.listen(PORT, err => {
  if (err) {
    console.log('error', err)
  } else {
    console.log(`Listening on ${PORT}`)
  }
})
