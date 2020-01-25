import { getUser, signUpUser, updateUser } from '../../../utils/auth'
import { log } from '../../../utils/logging'

export async function post(req, res) {
  const { email, fbId, name } = req.body

  res.setHeader('Content-Type', 'application/json')

  if (!fbId) {
    // email (and poss name) may be null
    log.error('Cannot authorize with Facebook, Facebook id missing')

    return res.end(
      JSON.stringify({
        user: null,
      })
    )
  }

  let user

  const userRecord = await getUser({ email, fbId })

  // Check if already user, and log straight in
  if (userRecord.id) {
    log.info('Facebook auth login', {}, userRecord.id)

    // Only return email, id and hasPassword
    const { email: emailRecord, id, name: nameRecord } = userRecord
    const registeredUser = {
      email: emailRecord,
      hasPassword: !!userRecord.password,
      id,
      name: nameRecord,
    }

    user = registeredUser

    // Only update with missing details from Facebook,
    // do not overwrite any values in db
    const updateObj = {}

    if (!registeredUser.email && email && registeredUser.email !== email) {
      updateObj.email = email
    }

    if (!registeredUser.name && name && registeredUser.name !== name) {
      updateObj.name = name
    }

    if (Object.keys(updateObj).length) {
      log.info(
        'Updating empty db values with Facebook data',
        updateObj,
        registeredUser.id
      )

      const { user: updatedUser } = await updateUser({
        id: parseInt(registeredUser.id),
        ...updateObj,
      })

      if (updatedUser) {
        user = updatedUser
      }
    }
  } else {
    log.info('Facebook auth signup')
    // Sign up user
    const { error, user: signedUpUser } = await signUpUser({
      email,
      fbId,
      name,
    })

    if (error) {
      log.error('Facebook signup', { error })
    } else {
      user = {
        ...signedUpUser,
        name,
      }
    }
  }

  if (user) {
    // Save user to session
    req.session.user = user

    // Delete session values
    delete req.session.hasPassword
    delete req.session.savedEmail

    return res.end(
      JSON.stringify({
        user,
      })
    )
  } else {
    log.error('Facebook auth, no user')
  }

  return res.end(
    JSON.stringify({
      user: null,
    })
  )
}
