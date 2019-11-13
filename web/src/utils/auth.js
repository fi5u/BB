/**
 * Get user data
 * @param {string} email Email of user to fetch
 */
export async function getUser(email, fbId) {
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
      return result.data.user
    }
  } catch (error) {
    console.log('Error getting result():')
    console.log(error.message)
  }
}

export async function updateUser(values) {
  console.log(`updateUser(${JSON.stringify(values)})`)

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

    console.log('userRecord:')
    console.log(userRecord)

    // Only return email and id
    const { email: emailRecord, id } = userRecord.data.updateUser
    const user = { email: emailRecord, id }
    console.log('user:')
    console.log(user)

    return { user }
  } catch (error) {
    console.log('Error updating user..')
    console.log(error.message)
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
  if ((!email && !fbId) || (!email && !password)) {
    console.log('Incorrect data')

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
      console.log('salt:')
      console.log(salt)

      passwordHashed = await crypto
        .createHash("sha256")
        .update(password)
        .update(salt)
        .digest("hex")

      console.log('password hashed:')
      console.log(passwordHashed)
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

      console.log('userRecord:')
      console.log(userRecord)

      // Only return email and id
      const { email: emailRecord, id } = userRecord.data.addUser
      const user = { email: emailRecord, id }
      console.log('user:')
      console.log(user)

      return { user }
    } catch (error) {
      console.log('Error signing up..')
      console.log(error.message)
      return {
        error: error.message,
        user: null,
      }
    }

  } catch (passwordHashError) {
    console.log('passwordHashError:')
    console.log(passwordHashError)

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
      success(user);

      return false
    } else {
      console.log("No errors, but no user!!");
      console.log(data);
    }
  }
}