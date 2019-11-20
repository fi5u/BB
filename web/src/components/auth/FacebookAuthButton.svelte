<script>
  import { goto, stores } from "@sapper/app";

  import FacebookAuth from "./FacebookAuth.svelte";

  const { session } = stores();

  function fbAuthSuccess(data) {
    $session.user = data.detail.user;

    goto("/app");
  }
</script>

<FacebookAuth
  on:init-error={ev => alert(ev.detail.error.message)}
  on:auth-failure={ev => alert('auth failure')}
  on:auth-success={fbAuthSuccess} />
