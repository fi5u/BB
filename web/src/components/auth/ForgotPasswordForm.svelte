<script>
  import Form from 'components/form/Form.svelte'

  export let emailAddress = ''
  export let submitSuccess

  let forgotPasswordForm = [
    {
      autocomplete: 'email',
      errorMessage: '',
      id: 'forgot-email',
      label: 'Email address',
      placeholder: 'Email address',
      type: 'email',
      value: emailAddress,
    },
    {
      id: 'forgot-button',
      label: 'Request new password',
      type: 'submit',
    },
  ]

  async function handleSubmit(event) {
    const { submitForgotPasswordForm } = await import('utils/auth')

    const updatedForm = await submitForgotPasswordForm(
      {
        email: forgotPasswordForm[0].value,
      },
      forgotPasswordForm,
      submitSuccess
    )

    if (updatedForm) {
      forgotPasswordForm = updatedForm
    }
  }
</script>

<Form bind:form={forgotPasswordForm} onsubmit={handleSubmit} />
