<script>
  import Form from 'components/form/Form.svelte'

  export let submitSuccess
  export let userId

  let resetPasswordForm = [
    {
      autocomplete: 'new-password',
      errorMessage: '',
      id: 'reset-password-new',
      label: 'New password',
      placeholder: 'Minimum 8 characters',
      type: 'password',
      value: '',
    },
    {
      autocomplete: 'new-password',
      errorMessage: '',
      id: 'reset-password-retype',
      label: 'Retype new password',
      placeholder: '',
      type: 'password',
      value: '',
    },
    {
      id: 'reset-button',
      label: 'Change password',
      type: 'submit',
    },
  ]

  /**
   * Submit reset password form
   * @param {object} Submit event
   */
  async function handleSubmit(event) {
    const { submitResetPasswordForm } = await import('utils/auth')

    const {
      updatedForm,
      notification: notifcationText,
    } = await submitResetPasswordForm(
      {
        passwordNew: resetPasswordForm[0].value,
        passwordRetype: resetPasswordForm[1].value,
        userId,
      },
      resetPasswordForm,
      submitSuccess
    )

    if (updatedForm) {
      resetPasswordForm = updatedForm
    }

    if (notifcationText) {
      const { getContext } = await import('svelte')

      const notification = getContext('notification')

      notification.createNotification(notifcationText)
    }
  }
</script>

<Form bind:form={resetPasswordForm} onsubmit={handleSubmit} />
