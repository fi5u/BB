<script>
  import Form from 'components/form/Form.svelte'

  export let emailAddress
  export let submitSuccess

  let verifyForm = [
    {
      autocomplete: 'current-password',
      errorMessage: '',
      id: 'verify-password',
      label: 'Password',
      placeholder: 'Password',
      type: 'password',
      value: '',
    },
    {
      id: 'verify-button',
      label: 'Log in',
      type: 'submit',
    },
  ]

  async function handleSubmit(event) {
    const { submitAuthForm } = await import('utils/auth')

    const updatedForm = await submitAuthForm(
      'verify',
      {
        email: emailAddress,
        password: verifyForm[0].value,
      },
      verifyForm,
      submitSuccess
    )

    if (updatedForm) {
      verifyForm = updatedForm
    }
  }
</script>

<Form bind:form={verifyForm} onsubmit={handleSubmit} />
