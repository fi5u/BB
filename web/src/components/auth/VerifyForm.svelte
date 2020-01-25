<script>
  import Form from '../form/Form.svelte'
  import { submitAuthForm } from '../../utils/auth'

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
