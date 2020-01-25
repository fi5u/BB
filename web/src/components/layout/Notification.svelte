<script>
  import { fly } from 'svelte/transition'

  export let text
</script>

<style>
  div {
    background-color: #fff;
    padding: 36px;
    position: absolute;
    text-align: center;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>

<div transition:fly={{ y: -200, duration: 200 }}>{text}</div>
