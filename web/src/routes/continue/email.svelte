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
  import { _ } from 'svelte-i18n'

  import PageTitle from '../../components/head/PageTitle.svelte'
  import { showLoadNotification } from '../../utils/notifications'
  import EmailCheck from '../../components/auth/EmailCheck.svelte'

  export let onLoadNotification = null
  export let segment = null

  const { session } = stores()
  const notification = getContext('notification')

  showLoadNotification(notification, onLoadNotification)

  function submittedForm({ email, hasFBLogin, hasPassword, userType }) {
    $session.savedEmail = email

    if (userType === 'current') {
      // Has password if signed up with email
      $session.hasPassword = hasPassword
      $session.hasFBLogin = hasFBLogin
    }

    if (userType === 'new') {
      goto('/continue/new')
    } else {
      goto('/continue/verify')
    }
  }
</script>

<PageTitle title="Continue with email" />

<p>{$_('label_continue_email')}</p>

<EmailCheck {submittedForm} />
