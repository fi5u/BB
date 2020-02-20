<script>
  import Form from 'components/form/Form.svelte'

  export let userStore
  const user = $userStore

  const initialPassword = {
    current: '',
    new: '',
    retype: '',
  }

  let password = initialPassword

  let updateSettingsForm = [
    {
      autocomplete: 'name',
      errorMessage: '',
      id: 'update-name',
      label: 'Name',
      placeholder: 'Name',
      type: 'text',
      value: user.name,
    },
    {
      autocomplete: 'email',
      errorMessage: '',
      id: 'update-email',
      label: 'Email address',
      placeholder: 'Email address',
      type: 'email',
      value: user.email,
    },
    {
      autocomplete: 'new-password',
      errorMessage: '',
      id: 'update-new-password',
      label: 'New password',
      placeholder: 'Minimum 8 characters',
      type: 'password',
      value: password.new,
    },
    {
      autocomplete: 'new-password',
      errorMessage: '',
      id: 'update-retype-password',
      label: 'Retype password',
      placeholder: 'Minimum 8 characters',
      type: 'password',
      value: password.retype,
    },
    {
      id: 'update-button',
      label: 'Save',
      type: 'submit',
    },
  ]

  if (user.hasPassword) {
    // Insert a current password as well
    updateSettingsForm.splice(2, 0, {
      autocomplete: 'current-password',
      errorMessage: '',
      id: 'update-current-password',
      label: 'Current password',
      placeholder: 'Current password',
      type: 'password',
      value: password.current,
    })
  }

  /**
   * Update value in form
   * @param {string} key Form key
   * @param {string} dbKey DB key
   */
  async function editUpdateObject(key, dbKey) {
    const { getValueFromForm, setValueInForm } = await import('utils/form')
    const formItemValue = getValueFromForm(updateSettingsForm, key)

    // If form value cleared (but has value in db), set error
    if (user[dbKey] && !formItemValue) {
      updateSettingsForm = setValueInForm(updateSettingsForm, key, {
        errorMessage: 'Oops, this cannot be empty',
      })

      return false
    }

    if (formItemValue && formItemValue !== user[dbKey]) {
      return formItemValue
    }

    return true
  }

  /**
   * Submit update settings form
   * @param event Submit event
   */
  async function submit(event) {
    event.preventDefault()

    const [
      { getContext },
      { getValueFromForm, setValueInForm },
      Buffer_,
      { clientFetch },
      { generatePasswordHash },
      { log },
    ] = await Promise.all([
      import('svelte'),
      import('utils/form'),
      import('buffer/'),
      import('utils/fetch'),
      import('utils/auth'),
      import('utils/logging'),
    ])

    const notification = getContext('notification')

    const updateObject = {
      id: parseInt(user.id),
    }

    const [updatedEmail, updatedName] = await Promise.all([
      editUpdateObject('update-email', 'email'),
      editUpdateObject('update-name', 'name'),
    ])

    if (!updatedName || !updatedEmail) {
      return
    }

    if (typeof updatedName === 'string') {
      updateObject.name = updatedName
    }

    if (typeof updatedEmail === 'string') {
      updateObject.email = updatedEmail
    }

    const currentPassword = getValueFromForm(
      updateSettingsForm,
      'update-current-password'
    )
    const newPassword = getValueFromForm(
      updateSettingsForm,
      'update-new-password'
    )
    const retypePassword = getValueFromForm(
      updateSettingsForm,
      'update-retype-password'
    )

    if (user.hasPassword) {
      if (newPassword && !currentPassword) {
        updateSettingsForm = setValueInForm(
          updateSettingsForm,
          'update-current-password',
          {
            errorMessage: 'Please add current password',
          }
        )

        return false
      }
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        updateSettingsForm = setValueInForm(
          updateSettingsForm,
          'update-new-password',
          {
            errorMessage: 'Password should be at least 8 characters',
          }
        )

        return false
      }

      if (!retypePassword) {
        updateSettingsForm = setValueInForm(
          updateSettingsForm,
          'update-retype-password',
          {
            errorMessage: 'Please retype new password',
          }
        )

        return false
      }

      if (newPassword !== retypePassword) {
        updateSettingsForm = setValueInForm(
          updateSettingsForm,
          'update-retype-password',
          {
            errorMessage: 'Passwords should match',
          }
        )

        return false
      }

      const Buffer = Buffer_.Buffer

      // TODO: PASSWORD NEEDED HERE, WHERE TO GET IT FROM
      // OTHER SOLUTION I.E. JWT ???
      const auth = `Basic ${new Buffer(
        `${emailCheckForm[0].value}:${currentPassword}`
      ).toString('base64')}`

      const { error, data } = await clientFetch(
        `/api/auth/user/${user.id}`,
        'GET',
        null,
        {
          headers: {
            Authorization: auth,
          },
        }
      )

      if (error || !data) {
        log.error('Error fetching user when saving password', {}, user.id)
        notification.createNotification(
          'Oops, an error occurred, please try again.'
        )

        return
      }

      const { user: userRecord } = data

      if (!userRecord) {
        log.error('No user returned when saving new password', {}, user.id)
        notification.createNotification('Oops, an error occurred')

        return
      }

      // Only verify if has a current password
      let isCurrentPasswordCorrect = true
      if (user.hasPassword) {
        const { error, data } = await clientFetch(
          '/api/auth/password',
          'POST',
          {
            passwordInput: currentPassword,
            userRecordPassword: userRecord.password,
            salt: userRecord.salt,
          }
        )

        if (error || !data) {
          log.error(
            'No data returned when verifying current password',
            {},
            user.id
          )
          notification.createNotification(
            'Oops, an error occurred, please try again.'
          )
        }

        const { isVerified } = data

        isCurrentPasswordCorrect = isVerified
      }

      if (!isCurrentPasswordCorrect) {
        log.info('Incorrect password when updating', {}, user.id)

        updateSettingsForm = setValueInForm(
          updateSettingsForm,
          'update-current-password',
          {
            errorMessage: 'Your current password is incorrect',
          }
        )

        return
      }

      const {
        generatedPasswordHashed,
        generatedSalt,
      } = await generatePasswordHash(newPassword)

      updateObject.password = generatedPasswordHashed
      updateObject.salt = generatedSalt
    }

    const { error: updateUserError, data: updateUserData } = await clientFetch(
      `/api/auth/user/${user.id}`,
      'PUT',
      null,
      {
        headers: {
          Authorization: auth,
        },
      }
    )

    if (updateUserError || !updateUserData) {
      log.error('Error updating user', {}, user.id)
      notification.createNotification('Oops, an error occurred')

      return
    }

    const { user: updatedUser } = updateUserData

    if (updatedUser) {
      notification.createNotification('Settings updated!')

      password = initialPassword

      userStore.update(prevValue => {
        const merged = {}

        // Loop through to merge, priority first order
        for (let key in updatedUser) {
          if (merged[key] === undefined || merged[key] === null) {
            merged[key] = updatedUser[key]
          }
        }

        for (let key in prevValue) {
          if (merged[key] === undefined || merged[key] === null) {
            merged[key] = prevValue[key]
          }
        }

        return merged
      })

      // Reset password fields in form
      ;[
        'update-current-password',
        'update-new-password',
        'update-retype-password',
      ].forEach(field => {
        updateSettingsForm = setValueInForm(updateSettingsForm, field, {
          value: '',
        })
      })
    } else {
      notification.createNotification(
        error || 'Could not update settings at this time.'
      )
    }
  }
</script>

<Form bind:form={updateSettingsForm} onsubmit={submit} />
