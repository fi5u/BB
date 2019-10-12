import * as jwt from 'jsonwebtoken'

export function generateJWT(user) {
  return jwt.sign({
    data: {
      id: user.id,
      email: user.email
    }
    // Note: should match middlewares/is-authorized.js
  }, 'fW3Scw4HspScmwW1CsFpcEnG', { expiresIn: '12h' }); // TODO move this to an env var
}