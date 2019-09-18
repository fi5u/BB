<script context="module">
  import { client } from "./_client";
  import gql from "graphql-tag";

  const USERS = gql`
    {
      users {
        email
      }
    }
  `;

  export async function preload() {
    // Persist after refresh
    await client.resetStore();

    return {
      cache: await client.query({
        query: USERS
      })
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { mutate, restore, setClient, query } from "svelte-apollo";
  import AddUser from "../components/AddUser.svelte";

  export let cache;

  const ADD_USER = gql`
    mutation($email: String!) {
      addUser(email: $email) {
        id
        email
      }
    }
  `;

  restore(client, USERS, cache.data);
  setClient(client);

  const users = query(client, { query: USERS });

  async function addUser(email) {
    try {
      await mutate(client, {
        mutation: ADD_USER,
        variables: { email }
      });

      // Rehydrate the cache
      const finalData = cache.data.users;
      finalData.push({ email, __typename: "User" });
      restore(client, USERS, { users: finalData });
    } catch (error) {
      console.error(error);
    }
  }

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

<AddUser {addUser} />
