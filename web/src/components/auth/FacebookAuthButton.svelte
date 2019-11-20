<script>
  import { goto, stores } from "@sapper/app";
  import { getContext } from "svelte";

  import FacebookAuth from "./FacebookAuth.svelte";

  const { session } = stores();

  function fbAuthFailure() {
    const notification = getContext("notification");

    notification.createNotification(
      "Oops, something went wrong logging in with Facebook, please try again."
    );
  }

  function fbAuthSuccess(data) {
    $session.user = data.detail.user;

    goto("/app");
  }
</script>

<FacebookAuth
  on:init-error={ev => alert(ev.detail.error.message)}
  on:auth-failure={fbAuthFailure}
  on:auth-success={fbAuthSuccess} />
