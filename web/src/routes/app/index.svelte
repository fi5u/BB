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
  import { goto, stores } from "@sapper/app";
  import fetch from "cross-fetch";

  export let user;

  const { session } = stores();

  async function logout() {
    const response = await fetch("api/auth/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    $session.user = null;
    goto("/");
  }
</script>

<h2>App</h2>

<button on:click={logout}>Logout</button>
