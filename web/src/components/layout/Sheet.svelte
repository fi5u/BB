<script>
  import { fly } from "svelte/transition";

  export let closeSheet;
  export let content;
  export let title;
</script>

<style>
  article {
    background: #fff;
    height: 100vh;
    left: 0;
    position: absolute;
    top: 0;
    width: 100vw;
  }
</style>

<article transition:fly>
  <button on:click={closeSheet}>X</button>
  <h1>{title}</h1>
  <div>{content}</div>
</article>
