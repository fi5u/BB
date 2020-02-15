<script>
  import Form from 'components/form/Form.svelte'
  import { submitAuthForm } from 'utils/auth'

  export let emailAddress = ''
  export let submitSuccess

  let signupForm = [
    {
      autocomplete: 'email',
      errorMessage: '',
      id: 'signup-email',
      label: 'Email address',
      placeholder: 'Email address',
      type: 'email',
      value: emailAddress,
    },
    {
      autocomplete: 'new-password',
      errorMessage: '',
      id: 'signup-password',
      label: 'Password',
      placeholder: 'Minimum 8 characters',
      type: 'password',
      value: '',
    },
    {
      id: 'signup-button',
      label: 'Sign up',
      type: 'submit',
    },
  ]

  async function handleSubmit(event) {
    const updatedForm = await submitAuthForm(
      'signup',
      {
        email: signupForm[0].value,
        password: signupForm[1].value,
      },
      signupForm,
      submitSuccess
    )

    if (updatedForm) {
      signupForm = updatedForm
    }
  }
</script>

<Form bind:form={signupForm} onsubmit={handleSubmit} />
