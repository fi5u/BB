<script>
  import { getContext } from 'svelte'

  import Form from '../form/Form.svelte'
  import {
    generatePasswordHash,
    getUser,
    updateUser,
    verifyPassword,
  } from '../../utils/auth'
  import { getValueFromForm, setValueInForm } from '../../utils/form'
  import { log } from '../../utils/logging'

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
   * Submit update settings form
   * @param event Submit event
   */
  async function submit(event) {
    event.preventDefault()

    const notification = getContext('notification')

    function editUpdateObject(key, dbKey) {
      const formItem = getValueFromForm(updateSettingsForm, key)

      // If form value cleared (but has value in db), set error
      if (user[dbKey] && !formItem) {
        updateSettingsForm = setValueInForm(updateSettingsForm, key, {
          errorMessage: 'Oops, this cannot be empty',
        })

        return false
      }

      if (formItem && formItem !== user[dbKey]) {
        updateObject[dbKey] = formItem
      }

      return true
    }

    const updateObject = {
      id: parseInt(user.id),
    }

    if (
      !editUpdateObject('update-name', 'name') ||
      !editUpdateObject('update-email', 'email')
    ) {
      return
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

      // First test does old password match with db
      const userRecord = await getUser({ id: parseInt(user.id) })

      if (!userRecord) {
        log.error('No user returned when saving new password', {}, user.id)
        notification.createNotification('Oops, an error occurred')

        return
      }

      // Only verify if has a current password
      const isCurrentPasswordCorrect = user.hasPassword
        ? await verifyPassword(
            currentPassword,
            userRecord.password,
            userRecord.salt
          )
        : true

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

    const { user: updatedUser, error } = await updateUser(updateObject)

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
