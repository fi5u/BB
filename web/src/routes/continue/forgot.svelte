<script context="module">
  import { protectRoute } from '../../utils/routes'

  export async function preload({ query }, { savedEmail }) {
    protectRoute(this, 'visitor')

    return {
      emailAddress: savedEmail,
    }
  }
</script>

<script>
  import { getContext } from 'svelte'

  import PageTitle from 'components/head/PageTitle.svelte'
  import ForgotPasswordForm from 'components/auth/ForgotPasswordForm.svelte'

  export let emailAddress
  export let segment = null

  const notification = getContext('notification')

  function submitSuccess() {
    notification.createNotification(
      'If you’re registered with us, we’ve sent a password reset link. Please check your inbox.'
    )
  }
</script>

<PageTitle title="Forgot password" />

<ForgotPasswordForm {emailAddress} {submitSuccess} />
