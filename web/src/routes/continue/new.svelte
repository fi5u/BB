<script context="module">
  import { protectRoute } from "../../utils/routes";

  export async function preload(page, { savedEmail, user }) {
    protectRoute(this, "visitor", user);

    return {
      emailAddress: savedEmail
    };
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";

  import SignupForm from "../../components/auth/SignupForm.svelte";

  export let emailAddress;

  const { session } = stores();

  function submitSuccess(user) {
    if (user) {
      $session.user = user;
      goto("/app");
    } else {
      goto("/continue/new");
    }
  }
</script>

<svelte:head>
  <title>Sign up • Baby Book</title>
</svelte:head>

<p>Welcome! Let's get a few more details from you.</p>
<SignupForm {emailAddress} {submitSuccess} />
