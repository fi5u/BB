<script>
  import { getContext } from "svelte";

  const userStore = getContext("userStore");
  const user = $userStore;
</script>

<h2>App</h2>
<p>
  {#if user && user.name}
    Name: {user.name}
    <br />
  {/if}

  {#if user && user.email}
    Email: {user.email}
    <br />
  {/if}
</p>
