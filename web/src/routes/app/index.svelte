<script context="module">
  export function preload(page, { user }) {
    if (!user) {
      console.log("no user redirecting:");
      return this.redirect(302, `/continue/email`);
    }

    return { user };
  }
</script>

<script>
  export let user;
</script>

<h2>App</h2>
{user ? 'Logged in' : 'Logged out'}
