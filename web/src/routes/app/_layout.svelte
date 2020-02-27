<script context="module">
  import { protectRoute } from 'utils/routes'

  export async function preload(page) {
    return await protectRoute(this, 'registered', true)
  }
</script>

<script>
  import { goto, stores } from '@sapper/app'
  import { setContext } from 'svelte'

  import Nav from 'components/layout/Nav.svelte'
  import { user as userStore } from 'stores/user.store'

  export let segment
  export let user

  const { session } = stores()

  const uStore = userStore(user)

  setContext('userStore', uStore)
</script>

<Nav {segment} />

<slot />
