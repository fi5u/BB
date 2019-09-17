<script>
  import { createApolloClient } from "../routes/_client";
  import { restore, mutate } from "svelte-apollo";

  import gql from "graphql-tag";

  export let cache;
  export let client;

  const USERS = gql`
    {
      users {
        email
      }
    }
  `;

  const ADD_USER = gql`
    mutation($email: String!) {
      addUser(email: $email) {
        id
      }
    }
  `;

  let email = "";

  async function addUser(e) {
    e.preventDefault();

    try {
      await mutate(client, {
        mutation: ADD_USER,
        variables: { email }
      });
      alert("Added successfully");
      const finalData = cache.data.users;
      console.log("finalData:");
      console.log(finalData);
      finalData.push({ email, __typename: "User" });
      restore(client, USERS, { users: finalData });
      console.log("New final data:");
      console.log(client.cache);
      // clear input
      email = "";
    } catch (error) {
      console.error(error);
    }
  }
</script>

<form on:submit={addUser}>
  <label for="author">Author</label>
  <input type="email" id="author-name" bind:value={email} />
  <button type="submit">Add Author</button>
</form>
