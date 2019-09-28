<script context="module">
  export async function preload({ query }) {
    return {
      emailAddress: query.e
    };
  }
</script>

<script>
  import * as sapper from "@sapper/app";

  import SignupForm from "../../components/auth/SignupForm.svelte";

  export let emailAddress;

  function submittedForm(status) {
    if (status === "success") {
      sapper.goto("/app");
    } else {
      sapper.goto("/continue/new");
    }
  }
</script>

<svelte:head>
  <title>Sign up • Baby Book</title>
</svelte:head>

<p>Welcome! Let's get a few more details from you.</p>
<SignupForm {emailAddress} {submittedForm} />
