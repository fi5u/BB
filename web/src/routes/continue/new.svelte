<script context="module">
  export async function preload({ query }) {
    return {
      emailAddress: query.e
    };
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";

  import SignupForm from "../../components/auth/SignupForm.svelte";

  export let emailAddress;

  const { session } = stores();

  function submittedForm(user) {
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
<SignupForm {emailAddress} {submittedForm} />
