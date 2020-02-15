<script>
  import { getContext } from 'svelte'

  import PageTitle from 'components/head/PageTitle.svelte'
  import UpdateSettings from 'components/settings/UpdateSettings.svelte'

  const userStore = getContext('userStore')
</script>

<PageTitle title="Settings" />

<h2>Settings</h2>
<UpdateSettings {userStore} />
