<script context="module">
  import { protectRoute } from "../../utils/routes";

  export function preload(page, { user }) {
    return protectRoute(this, "registered", user);
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
