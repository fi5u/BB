<script context="module">
  export async function preload({ query }) {
    return {
      emailAddress: query.e
    };
  }
</script>

<script>
  export let emailAddress;

  import VerifyForm from "../../components/auth/VerifyForm.svelte";
</script>

<svelte:head>
  <title>Log in • Baby Book</title>
</svelte:head>

<p>Welcome back!</p>
<p>{emailAddress}</p>
<VerifyForm {emailAddress} />
