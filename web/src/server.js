import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';

import express from 'express';
import bodyParser from 'body-parser'
import session from 'express-session'

import passport from 'passport'
import { localStrategy } from './server/passport'

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

passport.use(localStrategy);

const app = express()

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(session({ secret: 'ji2bW121dsldo62d8sm', resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  console.log('serialize')
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  console.log('deserialize')
  const userData = query(client, {
    query: GET_USER,
    variables: { email }
  });

  const result = await userData.result();

  if (!result.data.user) {
    return cb(new Error('No user'))
  }

  cb(null, result.data.user);
});

// Define routes
app.post('/login',
  (req, res, next) => {
    console.log('POST login')
    console.log(req.body)
    next()
  },
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/continue/verify',
    failureFlash: false
  }), (req, res) => {
    console.log('Login failed')
    res.redirect('/continue/verify')
  }
)

app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }));
app.use(sapper.middleware())

app.listen(PORT, () => { console.log(`Listening on ${PORT}`) })
