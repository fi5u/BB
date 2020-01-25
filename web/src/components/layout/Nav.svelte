<script>
  export let logout
  export let segment
</script>

<style>
  nav {
    display: flex;
  }

  a {
    margin-right: 32px;
  }

  a:last-child {
    margin-right: 0;
  }

  a.selected {
    font-weight: bold;
  }
</style>

<nav>
  <a class={segment === undefined ? 'selected' : ''} href="/app">Home</a>
  <a class={segment === 'settings' ? 'selected' : ''} href="/app/settings">
    Settings
  </a>
  <button on:click={logout}>Logout</button>
</nav>
