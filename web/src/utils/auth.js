import { log } from './logging'
import { service } from '../../../config'

/**
 * Get user data
 * @param {object} params Id params: email, fbId, id
 * @param {object} req Request object
 */
export async function getUser(params) {
  log.info('Get user', params)

  const [{ query }, { client }, { GET_USER }] = await Promise.all([
    import('svelte-apollo'),
    import('../routes/api/_graphql'),
    import('../routes/api/_graphql/_user'),
  ])

  const userData = query(client, {
    fetchPolicy: 'no-cache',
    query: GET_USER,
    variables: params,
  })

  try {
    const result = await userData.result()

    if (result && result.data && result.data.user) {
      await log.info('Found user', { id: result.data.user.id })

      return result.data.user
    } else {
      await log.info('No user')

      return {}
    }
  } catch (error) {
    await log.error('Error getting user', { ...params, error: error.message })
  }
}

export function authSuccess(user) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        id: user.id,
      })
    )
  }
}

/**
 * Log the user out from server
 **/
export async function logoutUser() {
  await fetch('api/auth/logout', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('user')
  }
}

export async function updateUser(values) {
  const { password, ...rest } = values

  // Remove password for logging
  let redactedValues = rest
  if (password) {
    redactedValues = {
      ...redactedValues,
      password: '•••',
    }
  }

  log.info('Update user', redactedValues, values.id)

  const [{ mutate }, { client }, { UPDATE_USER }] = await Promise.all([
    import('svelte-apollo'),
    import('../routes/api/_graphql'),
    import('../routes/api/_graphql/_user'),
  ])

  try {
    const userRecord = await mutate(client, {
      mutation: UPDATE_USER,
      variables: values,
    })

    // Only return email, name and id
    const {
      email: emailRecord,
      id,
      name: nameRecord,
    } = userRecord.data.updateUser
    const user = { email: emailRecord, id, name: nameRecord }

    log.info('Updated user', { id }, id)

    return { user }
  } catch (error) {
    const { password, ...redactedValues } = values

    if (values.password) {
      redactedValues.password = '•••'
    }

    log.error(
      'Could not update user',
      {
        error: error.message,
        ...redactedValues,
      },
      values.id
    )

    return {
      error: error.message,
      user: null,
    }
  }
}

/**
 * Sign a user up
 */
export async function signUpUser({ email, fbId, name, password }) {
  log.info('Sign up user', {
    email,
    fbId,
    name,
  })

  if ((!email && !fbId) || (!email && !password)) {
    log.error('Incorrect data', {
      email,
      fbId,
      name,
    })

    return {
      error: 'Incorrect data',
      user: null,
    }
  }

  const [{ mutate }, { client }, { ADD_USER }] = await Promise.all([
    import('svelte-apollo'),
    import('../routes/api/_graphql'),
    import('../routes/api/_graphql/_user'),
  ])

  try {
    let passwordHashed
    let salt

    if (password) {
      const {
        generatedPasswordHashed,
        generatedSalt,
      } = await generatePasswordHash(password)
      passwordHashed = generatedPasswordHashed
      salt = generatedSalt
    }

    try {
      const userRecord = await mutate(client, {
        mutation: ADD_USER,
        variables: {
          email,
          fbId,
          name,
          password: passwordHashed,
          salt,
        },
      })

      // Only return email and id
      const { email: emailRecord, id } = userRecord.data.addUser
      const user = { email: emailRecord, id }

      log.info('User signed up', user, id)

      return { user }
    } catch (error) {
      log.error('Signup', { email, error: error.message, fbId, name })

      return {
        error: error.message,
        user: null,
      }
    }
  } catch (passwordHashError) {
    log.error('Password hash error', {
      email,
      error: passwordHashError.message,
      fbId,
      name,
    })

    return {
      error: passwordHashError.message,
      user: null,
    }
  }
}

/**
 * Generate a password hash and salt returns object with salt and hash
 * @param {string} password Plain text password to hash
 */
export async function generatePasswordHash(password) {
  const Buffer_ = await import('buffer/')

  const Buffer = Buffer_.Buffer

  const base64Password = new Buffer(password).toString('base64')

  const response = await fetch(`${service.url}/api/auth/password`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      password: base64Password,
    },
  })

  const { generatedPasswordHashed, generatedSalt } = await response.json()

  return {
    generatedPasswordHashed,
    generatedSalt,
  }
}

/**
 * Verify a password with a salt
 * @param {string} passwordInput Password to verify
 * @param {string} userRecordPassword Hashed db password
 * @param {string} salt Salt to verify with
 */
export async function verifyPassword(passwordInput, userRecordPassword, salt) {
  const response = await fetch(`${service.url}/api/auth/password`, {
    body: JSON.stringify({ passwordInput, userRecordPassword, salt }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const { isVerified } = await response.json()

  return isVerified
}

/**
 * Submit signup / login form
 * @param {string} key Auth key
 * @param {object} inputData Email / password data
 * @param {object} formData Current form data
 * @param {(object) => void} success
 */
export async function submitAuthForm(key, inputData, formData, success) {
  const response = await fetch(
    `/api/auth/${key === 'verify' ? 'login' : key}`,
    {
      body: JSON.stringify(inputData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  )

  const { errors, user } = await response.json()

  if (errors) {
    errors.forEach(err => {
      const i = formData.findIndex(item => item.id === `${key}-${err.field}`)

      formData[i].errorMessage = err.error
    })

    return formData
  } else {
    if (user) {
      authSuccess(user)
      success(user)

      return false
    } else {
      log.error('Submit auth form, no user and no errors')
    }
  }
}

/**
 * Submit forgot password form.
 * We deliberately do not confirm incorrect email to prevent
 * attempts to guess an email.
 * @param {object} inputData Email data
 * @param {object} formData Current form data
 * @param {(object) => void} success
 */
export async function submitForgotPasswordForm(inputData, formData, success) {
  const response = await fetch(
    `/api/auth/forgot/${encodeURIComponent(inputData.email)}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
  )

  const { errors } = await response.json()

  if (errors) {
    errors.forEach(err => {
      const i = formData.findIndex(item => item.id === `forgot-${err.field}`)

      formData[i].errorMessage = err.error
    })
  } else {
    formData[0].value = ''

    success()
  }

  return formData
}

export async function submitResetPasswordForm(inputData, formData, success) {
  const response = await fetch('/api/auth/reset', {
    body: JSON.stringify({
      passwordNew: inputData.passwordNew,
      passwordRetype: inputData.passwordRetype,
      userId: inputData.userId,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const { errors } = await response.json()

  let notification

  if (errors) {
    errors.forEach(err => {
      if (err.field === 'notification') {
        notification = err.error
      } else {
        const i = formData.findIndex(item => item.id === `reset-${err.field}`)

        formData[i].errorMessage = err.error
      }
    })
  } else {
    formData[0].value = ''
    formData[1].value = ''

    success()
  }

  return { updatedForm: formData, notification }
}
