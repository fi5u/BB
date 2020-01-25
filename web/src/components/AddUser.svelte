<script>
  import { getClient, mutate, restore } from 'svelte-apollo'
  import gql from 'graphql-tag'

  export let addUser
  let email = ''

  function _addUser(e) {
    e.preventDefault()

    addUser(email)
    email = ''
  }
</script>

<form on:submit={_addUser}>
  <label for="author">Author</label>
  <input type="email" id="author-name" bind:value={email} />
  <button type="submit">Add Author</button>
</form>
