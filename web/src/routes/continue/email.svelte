<script context="module">
  import { getLoadNotification } from '../../utils/notifications'
  import { protectRoute } from '../../utils/routes'

  export function preload({ query }, { user }) {
    protectRoute(this, 'visitor', user)

    return getLoadNotification(query)
  }
</script>

<script>
  import { goto, stores } from '@sapper/app'
  import { getContext } from 'svelte'

  import { showLoadNotification } from '../../utils/notifications'
  import EmailCheck from '../../components/auth/EmailCheck.svelte'

  export let onLoadNotification = null
  export let segment = null

  const { session } = stores()
  const notification = getContext('notification')

  showLoadNotification(notification, onLoadNotification)

  function submittedForm({ email, hasPassword, userType }) {
    $session.savedEmail = email

    if (userType === 'current') {
      // Has password if signed up with email
      $session.hasPassword = hasPassword
    }

    if (userType === 'new') {
      goto('/continue/new')
    } else {
      goto('/continue/verify')
    }
  }
</script>

<svelte:head>
  <title>Continue with email • BB</title>
</svelte:head>

<p>Enter your email address to get going</p>

<EmailCheck {submittedForm} />
