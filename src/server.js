import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const client = redis.createClient()
const RedisStore = connectRedis(session)

polka()
  .use(session({
    store: new RedisStore({ client, host: 'redis', port: 6379 }),
    cookie: {
      maxAge: 604800000,
    },
    secret: 'hf52hnd2$jwj382n_mDw-qCwV',
    resave: false,
    rolling: true
  }))
  .use((req, res, next) => {
    console.log(req.session.user);
    console.log(req.session.refresh_token);
    if (typeof req.session.user === 'undefined') {
      req.session.user = false;
    }
    next()
  })
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware({
      session: (req, res) => ({
        user: req.session.user
      })
    })
  )
  .listen(PORT, err => {
    if (err) console.log('error', err);
  });
