<script context="module">
  import { createApolloClient } from "./_client";
  import gql from "graphql-tag";

  const client = createApolloClient();

  const USERS = gql`
    {
      users {
        email
      }
    }
  `;

  export async function preload() {
    return {
      cache: await client.query({
        query: USERS
      })
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { restore, query } from "svelte-apollo";

  export let cache;

  restore(client, USERS, cache.data);

  const users = query(client, { query: USERS });

  onMount(async () => {
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

{#await $users}
  <li>Loading...</li>
{:then result}
  {#each result.data.users as user (user.email)}
    <li>{user.email}</li>
  {:else}
    <li>No users found</li>
  {/each}
{:catch error}
  <li>Error loading users: {error}</li>
{/await}
