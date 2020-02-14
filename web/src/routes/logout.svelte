<script>
  import { stores } from '@sapper/app'

  import { onMount } from 'svelte'
  import { logoutUser } from '../utils/auth'
  import { user as userStore } from '../stores/user.store'

  export let user

  // Clear user store context
  const uStore = userStore(user)
  uStore.reset()

  const { session } = stores()
  $session = null

  onMount(async () => {
    await logoutUser()

    // Full load required to reset lang
    window.location.href = '/'
  })
</script>

<p>Logging out...</p>
