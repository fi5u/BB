<script context="module">
  import { getLoadNotification } from '../../utils/notifications'
  import { protectRoute } from '../../utils/routes'

  export async function preload(
    { query },
    { hasFBLogin, hasPassword, savedEmail, user }
  ) {
    // If no saved email, redirect back to email entry
    if (!savedEmail) {
      return this.redirect(302, '/continue/email')
    }

    protectRoute(this, 'visitor', user)

    return {
      ...getLoadNotification(query),
      emailAddress: savedEmail,
      hasFailed: query.success === '0',
      hasFBLogin,
      hasPassword,
    }
  }
</script>

<script>
  import { goto, stores } from '@sapper/app'
  import { getContext } from 'svelte'

  import PageTitle from '../../components/head/PageTitle.svelte'
  import { log } from '../../utils/logging'
  import { showLoadNotification } from '../../utils/notifications'
  import FacebookAuthButton from '../../components/auth/FacebookAuthButton.svelte'
  import VerifyForm from '../../components/auth/VerifyForm.svelte'

  export let emailAddress
  export let hasFailed
  export let hasFBLogin
  export let hasPassword
  export let onLoadNotification = null
  export let segment = null

  const { session } = stores()

  const notification = getContext('notification')

  showLoadNotification(notification, onLoadNotification)

  function submitSuccess(user) {
    if (user) {
      $session.user = user
      return goto('/app')
    }

    log.error('Could not verify, no user')
  }
</script>

<PageTitle title="Log in" />

<p>
  {hasFailed ? 'Oops, incorrect login details, please try again' : 'Welcome back!'}
</p>

{#if hasPassword}
  <p>{emailAddress}</p>

  <VerifyForm {emailAddress} {submitSuccess} />

  <a href="/continue/forgot">Forgot password</a>

  {#if hasFBLogin}
    <p>Or log in with Facebook</p>
    <FacebookAuthButton />
  {/if}
{:else}
  <p>Log in with Facebook</p>
  <FacebookAuthButton />
{/if}
