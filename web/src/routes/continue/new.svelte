<script context="module">
  import { protectRoute } from 'utils/routes'

  export async function preload(page, { savedEmail, user }) {
    protectRoute(this, 'visitor', user)

    return {
      emailAddress: savedEmail,
    }
  }
</script>

<script>
  import { goto, stores } from '@sapper/app'

  import PageTitle from 'components/head/PageTitle.svelte'
  import SignupForm from 'components/auth/SignupForm.svelte'

  export let emailAddress

  const { session } = stores()

  function submitSuccess(user) {
    if (user) {
      $session.user = user
      goto('/app')
    } else {
      goto('/continue/new')
    }
  }
</script>

<PageTitle title="Sign up" />

<p>Welcome! Let's get a few more details from you.</p>
<SignupForm {emailAddress} {submitSuccess} />
