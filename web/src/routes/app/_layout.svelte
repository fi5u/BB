<script context="module">
  import { protectRoute } from "../../utils/routes";

  export function preload(page, { user }) {
    return protectRoute(this, "registered", user);
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";
  import fetch from "cross-fetch";

  import Nav from "../../components/layout/Nav.svelte";

  export let segment;
  export let user;

  const { session } = stores();

  /**
   * Log the user out
   **/
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

<Nav {logout} {segment} />

<slot />
