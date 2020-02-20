<script>
  import * as sapper from '@sapper/app'
  import Buffer_ from 'buffer/'

  import Form from 'components/form/Form.svelte'

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

  /**
   * Submit error log and notification
   */
  async function submitError(errorMessage) {
    const { generalError } = await import('utils/notifications')

    generalError(errorMessage, {
      email: emailCheckForm[0].value,
    })
  }

  /**
   * Submit email check form
   */
  async function submit(event) {
    event.preventDefault()

    const Buffer = Buffer_.Buffer

    const auth = `Basic ${new Buffer(`${emailCheckForm[0].value}`).toString(
      'base64'
    )}`

    const { clientFetch } = await import('utils/fetch')

    const { error, data } = await clientFetch('/api/auth/user', 'GET', null, {
      headers: {
        Authorization: auth,
      },
    })

    if (error || !data) {
      return submitError('Error submitting email address')
    }

    const { user } = data

    if (!user) {
      return submitError('No user returned')
    }

    submittedForm({
      email: emailCheckForm[0].value,
      hasFBLogin: user.hasFBLogin,
      hasPassword: user.hasPassword,
      userType: user && user.id ? 'current' : 'new',
    })
  }
</script>

<Form bind:form={emailCheckForm} onsubmit={submit} />
