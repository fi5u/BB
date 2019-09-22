import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser'

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = express() // You can also use Express
  .use(
    bodyParser.json(),
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware()
  );

const server = http.createServer(app);

server.listen(PORT, err => {
  if (err) console.log('error', err);
});
