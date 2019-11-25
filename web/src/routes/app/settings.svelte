<script>
  import { getContext } from "svelte";

  import UpdateSettings from "../../components/settings/UpdateSettings.svelte";

  const userStore = getContext("userStore");
</script>

<h2>Settings</h2>
<UpdateSettings {userStore} />
