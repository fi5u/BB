import { getUser, signUpUser, updateUser } from '../../../utils/auth'
import { log } from '../../../utils/logging'

export async function post(req, res) {
  const { email, fbId, name } = req.body

  res.setHeader('Content-Type', 'application/json');

  if (!fbId) {
    // email (and poss name) may be null
    log.error('Cannot authorize with Facebook, Facebook id missing')

    return res.end(JSON.stringify({
      user: null,
    }));
  }

  let user

  const registeredUser = await getUser(email, fbId)

  // Check if already user, and log straight in
  if (registeredUser) {
    log.info('Facebook auth login', {}, registeredUser.id)
    user = registeredUser

    // If email or name different to saved, save to db
    // Making sure not to overwrite with empty values
    if ((email && registeredUser.email !== email) || (name && registeredUser.name !== name)) {
      const updatedUser = await updateUser({ email, id: parseInt(registeredUser.id), name })

      if (user) {
        user = updatedUser
      }
    }
  } else {
    log.info('Facebook auth signup')
    // Sign up user
    const { error, user: signedUpUser } = await signUpUser({
      email,
      fbId,
      name
    })

    if (error) {
      log.error('Facebook signup', { error })
    } else {
      user = signedUpUser
    }
  }

  if (user) {
    // Save user to session
    req.session.user = user;

    return res.end(JSON.stringify({
      user,
    }));
  } else {
    log.error('Facebook auth, no user')
  }

  return res.end(JSON.stringify({
    user: null
  }));
}