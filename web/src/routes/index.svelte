<script context="module">
  import { protectRoute } from "../utils/routes";

  export function preload(page, { user }) {
    return protectRoute(this, "visitor", user);
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";

  import FacebookAuth from "../components/auth/FacebookAuth.svelte";
  import Smallprint from "../components/policies/Smallprint.svelte";

  const { session } = stores();

  function fbAuthSuccess(data) {
    $session.user = data.detail.user;

    goto("/app");
  }
</script>

<style>
  h1,
  figure {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>BB</title>
</svelte:head>

<figure>
  <img alt="B" src="https://placehold.it/600" />
</figure>

<h1>BB</h1>

<FacebookAuth
  on:init-error={ev => alert(ev.detail.error.message)}
  on:auth-failure={ev => alert('auth failure')}
  on:auth-success={fbAuthSuccess} />

<a href="/continue/email">Continue with email</a>

<Smallprint key="continue" />
