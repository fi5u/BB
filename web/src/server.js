import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';

import express from 'express';
import bodyParser from 'body-parser'
import session from 'express-session'

import { login } from './server/auth/login'
import { signup } from './server/auth/signup'

import isAuth from './server/middlewares/is-authorized'
import attachCurrentUser from './server/middlewares/attach-current-user'

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = express()

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(session({ secret: 'ji2bW121dsldo62d8sm', resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define routes
app.post('/login', login)
app.post('/signup', signup)
app.get('/app', isAuth, attachCurrentUser, (req, res, next) => {
  next()
})

app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }));
app.use(sapper.middleware())

app.listen(PORT, () => { console.log(`Listening on ${PORT}`) })
