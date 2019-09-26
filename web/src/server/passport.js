import { query } from "svelte-apollo";
import { client } from '../routes/api/_graphql'
import { GET_USER } from '../routes/api/_graphql/_user'
import { Strategy } from 'passport-local'

export const localStrategy = new Strategy({
  usernameField: 'email'
},
  async (email, password, done) => {
    console.log('logging in with ' + email)
    console.log('pw: ' + password)
    try {
      const userData = query(client, {
        query: GET_USER,
        variables: { email }
      });

      const result = await userData.result();

      if (!result.data.user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      // Create a password check function
      if (true /* !user.validPassword(password) */) {
        console.log('Failed')
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, result.data.user);
    } catch (error) {
      return done(error)
    }
  }
);