<script context="module">
  export async function preload({ query }) {
    return {
      emailAddress: query.e
    };
  }
</script>

<script>
  export let emailAddress;

  import SignupForm from "../../components/auth/SignupForm.svelte";
</script>

<svelte:head>
  <title>Sign up • Baby Book</title>
</svelte:head>

<p>Welcome! Let's get a few more details from you.</p>
<SignupForm {emailAddress} />
