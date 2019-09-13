<script context="module">
  export function preload(page, { user }) {
    return { user };
  }
</script>

<script>
  export let user;

  import { stores } from "@sapper/app";
  const { session } = stores();
</script>

<h2>App</h2>
{user ? 'Logged in' : 'Logged out'}
