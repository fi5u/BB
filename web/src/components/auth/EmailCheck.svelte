<script>
  import * as sapper from '@sapper/app'
  import Buffer_ from 'buffer/'

  import Form from '../form/Form.svelte'

  export let submittedForm

  let emailCheckForm = [
    {
      autocomplete: 'email',
      id: 'check-email',
      label: 'Email address',
      placeholder: 'Email address',
      type: 'email',
      value: '',
    },
    {
      id: 'check-email-button',
      label: 'Next',
      type: 'submit',
    },
  ]

  async function submit(event) {
    event.preventDefault()

    const Buffer = Buffer_.Buffer

    const auth = `Basic ${new Buffer(`${emailCheckForm[0].value}`).toString(
      'base64'
    )}`

    const response = await fetch('/api/auth/user', {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        Authorization: auth,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    const { user } = await response.json()

    submittedForm({
      email: emailCheckForm[0].value,
      hasFBLogin: user.hasFBLogin,
      hasPassword: user.hasPassword,
      userType: user && user.id ? 'current' : 'new',
    })
  }
</script>

<Form bind:form={emailCheckForm} onsubmit={submit} />
