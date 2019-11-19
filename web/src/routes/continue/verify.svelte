<script context="module">
  import { protectRoute } from "../../utils/routes";

  export async function preload({ query }, { savedEmail, user }) {
    // If no saved email, redirect back to email entry
    if (!savedEmail) {
      return this.redirect(302, "/continue/email");
    }

    protectRoute(this, "visitor", user);

    return {
      emailAddress: savedEmail,
      hasFailed: query.success === "0"
    };
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";

  import VerifyForm from "../../components/auth/VerifyForm.svelte";
  import { log } from "../../utils/logging";

  export let emailAddress;
  export let hasFailed;

  const { session } = stores();

  function submitSuccess(user) {
    if (user) {
      $session.user = user;
      return goto("/app");
    }

    log.error("Could not verify, no user");
  }
</script>

<svelte:head>
  <title>Log in • BB</title>
</svelte:head>

<p>
  {hasFailed ? 'Oops, incorrect login details, please try again' : 'Welcome back!'}
</p>
<p>{emailAddress}</p>
<VerifyForm {emailAddress} {submitSuccess} />
