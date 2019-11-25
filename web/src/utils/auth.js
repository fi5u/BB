import { log } from "./logging";

/**
 * Get user data
 * @param {string} email Email of user to fetch
 */
export async function getUser(email, fbId) {
  log.info('Get user', { email, fbId })

  const [{ query }, { client }, { GET_USER }] = await Promise.all([
    import('svelte-apollo'),
    import('../routes/api/_graphql'),
    import('../routes/api/_graphql/_user')
  ])

  const userData = query(client, {
    fetchPolicy: 'no-cache',
    query: GET_USER,
    variables: { email, fbId }
  });

  try {
    const result = await userData.result();

    if (result && result.data && result.data.user) {
      log.info('Found user', { id: result.data.user.id }, result.data.user.id)

      return result.data.user
    } else {
      throw new Error('No user')
    }
  } catch (error) {
    log.error('Error getting user', { email, error: error.message, fbId })
  }
}

export function authSuccess(user) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('user', JSON.stringify({
      id: user.id
    }))
  }
}

/**
 * Log the user out from server
 **/
export async function logoutUser() {
  await fetch("api/auth/logout", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('user')
  }
}

export async function updateUser(values) {
  log.info('Update user', values, values.id)

  const [{ mutate }, { client }, { UPDATE_USER }] = await Promise.all([
    import('svelte-apollo'),
    import('../routes/api/_graphql'),
    import('../routes/api/_graphql/_user'),
  ])

  try {
    const userRecord = await mutate(client, {
      mutation: UPDATE_USER,
      variables: values
    });

    // Only return email, name and id
    const { email: emailRecord, id, name: nameRecord } = userRecord.data.updateUser
    const user = { email: emailRecord, id, name: nameRecord }

    log.info('Updated user', { id }, id)

    return { user }
  } catch (error) {
    log.error('Could not update user', {
      error: error.message,
      ...values,
    }, values.id)

    return {
      error: error.message,
      user: null,
    }
  }
}

/**
 * Sign a user up
 */
export async function signUpUser({
  email,
  fbId,
  name,
  password
}) {
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
      salt = await crypto.randomBytes(24).toString('hex')

      passwordHashed = await crypto
        .createHash("sha256")
        .update(password)
        .update(salt)
        .digest("hex")
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
        }
      });

      // Only return email and id
      const { email: emailRecord, id } = userRecord.data.addUser
      const user = { email: emailRecord, id }

      log.info('User signed up', user)

      return { user }
    } catch (error) {
      log.error('Signup', { error: error.message })

      return {
        error: error.message,
        user: null,
      }
    }

  } catch (passwordHashError) {
    log.error('Password hash error', { error: passwordHashError.message })

    return {
      error: passwordHashError.message,
      user: null,
    }
  }
}

/**
 * Submit signup / login form
 * @param {Event} event Submit event
 * @param {string} key Auth key
 * @param {object} inputData Email / password data
 * @param {object} formData Current form data
 * @param {(object) => void} success
 */
export async function submitAuthForm(key, inputData, formData, success) {
  const response = await fetch(`/api/auth/${key === 'verify' ? 'login' : key}`, {
    body: JSON.stringify(inputData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
  });

  const { error, user } = await response.json();

  if (error) {
    error.forEach(err => {
      const i = formData.findIndex(
        item => item.id === `${key}-${err.field}`
      );

      formData[i].errorMessage = err.error;
    });

    return formData
  } else {
    if (user) {
      authSuccess(user);
      success(user);

      return false
    } else {
      log.error('Submit auth form, no user and no errors')
      // TODO: notification back to user
    }
  }
}