<script>
  import { goto, stores } from '@sapper/app'
  import FacebookAuth from 'components/auth/FacebookAuth.svelte'

  const { session } = stores()

  /**
   * Facebook auth failed
   */
  async function fbAuthFailure() {
    const { getContext } = await import('svelte')

    const notification = getContext('notification')

    notification.createNotification(
      'Oops, something went wrong logging in with Facebook, please try again.'
    )
  }

  /**
   * Facebook auth success
   * @param {object} data Data passed from Facebook
   */
  async function fbAuthSuccess(data) {
    $session.user = data.detail.user

    goto('/app')
  }
</script>

<FacebookAuth
  on:init-error={ev => alert(ev.detail.error.message)}
  on:auth-failure={fbAuthFailure}
  on:auth-success={fbAuthSuccess}
/>
