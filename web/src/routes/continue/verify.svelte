<script context="module">
  import { protectRoute } from "../../utils/routes";

  export async function preload({ query }, { user }) {
    protectRoute(this, "visitor", user);

    return {
      emailAddress: query.e,
      hasFailed: query.success === "0"
    };
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";

  import VerifyForm from "../../components/auth/VerifyForm.svelte";

  export let emailAddress;
  export let hasFailed;

  const { session } = stores();

  function handleFormSubmitted(user) {
    if (user) {
      $session.user = user;
      return goto("/app");
    }
    console.log("Error in submitting form");
  }
</script>

<svelte:head>
  <title>Log in • Baby Book</title>
</svelte:head>

<p>
  {hasFailed ? 'Oops, incorrect login details, please try again' : 'Welcome back!'}
</p>
<p>{emailAddress}</p>
<VerifyForm {emailAddress} {handleFormSubmitted} />
