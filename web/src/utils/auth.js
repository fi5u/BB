import { log } from 'utils/logging'
import { service } from 'config'

/**
 * Auth error log and notification
 */
async function authError(errorMessage, logParams) {
  const { generalError } = await import('utils/notifications')

  generalError(errorMessage, logParams)
}

/**
 * Get user data
 * @param {object} params Id params: email, fbId, id
 * @param {object} req Request object
 */
export async function getUser(params) {
  log.info('Get user', params)

  const [{ query }, { client }, { GET_USER }] = await Promise.all([
    import('svelte-apollo'),
    import('api/_graphql'),
    import('api/_graphql/_user'),
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
  const { clientFetch } = await import('utils/fetch')

  const { error, data } = await clientFetch(
    '/api/auth/logout',
    'POST',
    null,
    {}
  )

  if (error || !data || !data.ok) {
    authError('Error logging out')
  }

  if (typeof window !== 'undefined') {
    window.localStorage.clear()
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
    import('api/_graphql'),
    import('api/_graphql/_user'),
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
    import('api/_graphql'),
    import('api/_graphql/_user'),
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
  const [Buffer_, { clientFetch }] = await Promise.all([
    import('buffer/'),
    import('utils/fetch'),
  ])

  const Buffer = Buffer_.Buffer

  const base64Password = new Buffer(password).toString('base64')

  const { error, data } = await clientFetch('/api/auth/password', 'GET', null, {
    headers: {
      password: base64Password,
    },
  })

  if (error || !data) {
    return authError('Error logging out')
  }

  const { generatedPasswordHashed, generatedSalt } = data

  return {
    generatedPasswordHashed,
    generatedSalt,
  }
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
      credentials: 'include',
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
      credentials: 'include',
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
    credentials: 'include',
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
