<script context="module">
  import { protectRoute } from "../../utils/routes";

  export function preload(page, { user }) {
    return protectRoute(this, "registered", user);
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";
  import { logoutUser } from "../../utils/auth";

  import Nav from "../../components/layout/Nav.svelte";

  export let segment;
  export let user;

  const { session } = stores();

  /**
   * Log the user out
   **/
  async function logout() {
    await logoutUser();

    $session.user = null;
    goto("/");
  }
</script>

<Nav {logout} {segment} />

<slot />
