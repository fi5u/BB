<script context="module">
  export function preload(page, { user }) {
    console.log("app session:");
    console.log(user);
    if (!user) {
      console.log("no user redirecting:");
      console.log(user);
      return this.redirect(302, `/continue/email`);
    }

    return { user };
  }
</script>

<script>
  export let user;

  // import { stores } from "@sapper/app";
  // const { session } = stores();
</script>

<h2>App</h2>
{user ? 'Logged in' : 'Logged out'}
