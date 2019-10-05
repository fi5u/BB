import { query } from "svelte-apollo";
import { client } from '../../routes/api/_graphql'
import { GET_USER } from '../../routes/api/_graphql/_user'
import { Strategy } from 'passport-local'
import bcrypt from 'bcrypt'

export const localStrategy = new Strategy({
  usernameField: 'email'
},
  async (email, password, done) => {
    try {
      const userData = query(client, {
        query: GET_USER,
        variables: { email }
      });

      const result = await userData.result();

      if (!result.data.user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      const match = await bcrypt.compare(password, result.data.user.password)
      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, result.data.user);
    } catch (error) {
      console.log('Login error')
      return done(error)
    }
  }
);

export function serializeUser(user, cb) {
  console.log('serialize')
  console.log(user)
  cb(null, user.email);
}

export async function deserializeUser(email, cb) {
  console.log('deserialize')
  const userData = query(client, {
    query: GET_USER,
    variables: { email }
  });

  const result = await userData.result();

  if (!result.data.user) {
    return cb(new Error('No user'))
  }

  console.log('user:')
  console.log(result.data.user)

  cb(null, result.data.user);
}