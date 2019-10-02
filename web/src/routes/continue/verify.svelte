<script context="module">
  export async function preload({ query }) {
    return {
      emailAddress: query.e,
      hasFailed: query.success === "0"
    };
  }
</script>

<script>
  import * as sapper from "@sapper/app";

  import VerifyForm from "../../components/auth/VerifyForm.svelte";

  export let emailAddress;
  export let hasFailed;

  function handleFormSubmitted(redirectUrl) {
    sapper.goto(redirectUrl);
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
