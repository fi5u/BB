import { mutate } from "svelte-apollo";
import { client } from '../../routes/api/_graphql'
import { ADD_USER } from '../../routes/api/_graphql/_user'

export async function signup(req, res) {
  const { email, password } = req.body

  console.log('signing up with')
  console.log(email, password)

  try {
    const user = await mutate(client, {
      mutation: ADD_USER,
      variables: { email, password }
    });

    console.log('signed up:')
    console.log(user)

    res.sendStatus(200)
  } catch (error) {
    console.log('Error signing up')
    console.log(error.message)

    res.sendStatus(400)
  }
}