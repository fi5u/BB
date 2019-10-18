<script context="module">
  import { protectRoute } from "../utils/routes";

  export function preload(page, { user }) {
    return protectRoute(this, "visitor", user);
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
  <title>Baby Book</title>
</svelte:head>

<figure>
  <img alt="Baby" src="https://placehold.it/600" />
</figure>

<h1>Baby book</h1>

<a href="/continue/email">Continue with email</a>
