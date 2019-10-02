import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';

import express from 'express';
import bodyParser from 'body-parser'
import session from 'express-session'

import passport from 'passport'
import { deserializeUser, localStrategy, serializeUser } from './server/auth/passport'
import { signup } from './server/auth/signup'

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

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

// Define routes
app.post('/login', passport.authenticate('local', {
  successRedirect: '/app',
  failureRedirect: `/continue/verify?success=0`,
  failureFlash: false,
}))

app.post('/signup', signup)

app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }));
app.use(sapper.middleware())

app.listen(PORT, () => { console.log(`Listening on ${PORT}`) })
