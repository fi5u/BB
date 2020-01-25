<script context="module">
  import Buffer_ from 'buffer/'

  import { log } from '../../../utils/logging'
  import { protectRoute } from '../../../utils/routes'

  export async function preload({ params, query }, { user }) {
    const { userIdString } = params

    protectRoute(this, 'visitor', user)

    let resetPreventReason = ''

    try {
      if (!userIdString) {
        throw new Error('No user id passed')
      }

      const Buffer = Buffer_.Buffer

      const userIdStringDecoded = Buffer.from(userIdString, 'base64').toString()

      const userIdSplit = userIdStringDecoded.split('id')

      if (
        userIdStringDecoded.indexOf('id') !== 0 ||
        userIdSplit.length !== 2 ||
        isNaN(Number(userIdSplit[1]))
      ) {
        throw new Error(
          `Incorrect id format: ${userIdStringDecoded} from ${userIdString}`
        )
      }

      const result = await this.fetch(`/api/auth/reset/${userIdSplit[1]}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      const { isPermitted, email, reason } = await result.json()

      if (!isPermitted) {
        resetPreventReason = reason

        throw new Error(`Not permitted to reset password: ${userIdSplit[1]}`)
      }

      return {
        email,
        isValidRequest: true,
        userId: userIdSplit[1],
      }
    } catch (error) {
      log.info('Reset password', {
        error: error.message,
        reason: resetPreventReason,
      })

      return this.redirect(302, '/continue/email?e=reset')
    }
  }
</script>

<script>
  import { goto, stores } from '@sapper/app'

  import ResetPasswordForm from '../../../components/auth/ResetPasswordForm.svelte'

  export let email
  export let isValidRequest
  export let userId

  const { session } = stores()

  // Note: if $session is set inside submitSuccess callback, then preload will
  // run again causing errors
  if (email) {
    $session.savedEmail = email
  }

  $session.hasPassword = true

  function submitSuccess() {
    // Note: using `goto` does not show the load notificatino
    window.location.href = '/continue/verify?s=reset'
  }
</script>

<svelte:head>
  <title>Reset password • BB</title>
</svelte:head>

<ResetPasswordForm {submitSuccess} {userId} />
