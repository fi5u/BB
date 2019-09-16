<script>
  import gql from "graphql-tag";
  import { onMount } from "svelte";
  import { createApolloClient } from "./_client";

  let random = 0;
  let randoms = 0;

  onMount(async () => {
    const client = createApolloClient();

    try {
      const result = await client.query({
        query: gql`
          {
            users {
              email
            }
          }
        `
      });

      console.log(result);
    } catch (error) {
      console.log("Error in fetching data:");
      console.log(error.message);
    }

    // client.query({
    //   query: gql`{ random }`
    // }).then(result => {
    //   random = result.data.random;
    // });

    // client.subscribe({
    //   query: gql`subscription { randoms }`
    // }).subscribe(result => {
    //  randoms = result.data.randoms;
    // });
  });
</script>

<svelte:head>
  <title>About</title>
</svelte:head>

<h1>About this site</h1>

<p>This is the 'about' page. There's not much here.</p>

<div>
  Random: {random}
  <br />
  Randoms: {randoms}
</div>
