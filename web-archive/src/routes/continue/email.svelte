<script context="module">
  import "cross-fetch/polyfill";
  import { client } from "../../data/client";
  import { gql } from "apollo-boost";

  const PAGE_QUERIES = gql`
    query GetUsers {
      users {
        email
      }
    }
  `;

  export async function preload() {
    return {
      cache: await client.query({
        query: PAGE_QUERIES
      })
    };
  }
</script>

<script>
  import EmailCheck from "../../components/auth/EmailCheck.svelte";

  import { ADD_USER, GET_USERS } from "../../data/queries/users";
  import { setClient, restore, mutate, query } from "svelte-apollo";

  export let cache;
  restore(client, PAGE_QUERIES, cache.data);
  setClient(client);

  // query a subset of the preloaded (the rest if for Account)
  const users = query(client, { query: GET_USERS });

  let testInput = "";
  let hasSent = false;

  async function testSend() {
    try {
      await mutate(client, {
        mutation: ADD_USER,
        variables: { email: testInput }
      });

      hasSent = true;
    } catch (error) {
      // TODO
      console.log("Ooops:");
      console.log(error);
    }
  }

  $: users.refetch({ hasSent });
</script>

<svelte:head>
  <title>Continue with email • Baby Book</title>
</svelte:head>

<p>Enter your email address to get going</p>
<EmailCheck />

<input type="text" bind:value={testInput} />
<button on:click={testSend}>SAVE</button>

<ul>
  {#await $users}
    <li>Loading...</li>
  {:then result}
    {#each result.data.users as user}
      <li>{JSON.stringify(user)}</li>
    {/each}
  {:catch error}
    <li>ERROR: {error}</li>
  {/await}
</ul>
