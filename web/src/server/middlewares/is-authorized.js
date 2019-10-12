import jwt from 'express-jwt';

const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
}

const jsonwebtoken = jwt({
  secret: 'fW3Scw4HspScmwW1CsFpcEnG', // Note: should match auth/jwt.js
  userProperty: 'token', // this is where the next middleware can find the encoded data generated in services/auth:generateToken
  getToken: getTokenFromHeader,
})

export default jsonwebtoken