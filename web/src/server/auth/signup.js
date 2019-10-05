import { mutate } from "svelte-apollo";
import { client } from '../../routes/api/_graphql'
import { ADD_USER } from '../../routes/api/_graphql/_user'
import bcrypt from 'bcrypt'

const saltRounds = 10

export async function signup(req, res) {
  const { email, password } = req.body

  console.log('signing up with')
  console.log(email, password)

  // TODO: validate email + password here

  try {
    const hash = await bcrypt.hash(password, saltRounds)

    try {
      const user = await mutate(client, {
        mutation: ADD_USER,
        variables: { email, password: hash }
      });

      console.log('signed up:')
      console.log(user)

      res.sendStatus(200)
    } catch (error) {
      console.log('Error signing up')
      console.log(error.message)

      res.sendStatus(400)
    }
  } catch (bcryptError) {
    console.log('Hash error:')
    console.log(bcryptError.message)

    res.sendStatus(400)
  }
}