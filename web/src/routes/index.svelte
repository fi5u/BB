<script context="module">
  import { protectRoute } from '../utils/routes'

  export function preload(page, { user }) {
    return protectRoute(this, 'visitor', user)
  }
</script>

<script>
  import { service } from '../../../config'
  import PageTitle from '../components/head/PageTitle.svelte'
  import Smallprint from '../components/policies/Smallprint.svelte'
  import FacebookAuthButton from '../components/auth/FacebookAuthButton.svelte'
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

<PageTitle />

<figure>
  <img alt="BB" height="400" src="https://placehold.it/600" width="400" />
</figure>

<h1>{service.name}</h1>

<FacebookAuthButton />

<a href="/continue/email">Continue with email</a>

<Smallprint key="continue" />
