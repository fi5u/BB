import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const FileStore = sessionFileStore(session);

polka()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(session({
    secret: 'vlsSw3dCsWtr53G8VdloapFw2dCnMmfeE',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 31536000
    },
    store: new FileStore({
      path: process.env.NOW ? `/tmp/sessions` : `.sessions`
    })
  }))
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware({
      session: req => ({
        user: req.session && req.session.user
      })
    })
  )
  .listen(PORT, err => {
    if (err) {
      console.log('error', err)
    } else {
      console.log(`Listening on ${PORT}`)
    }
  });