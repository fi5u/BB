<script>
  import { setContext } from "svelte";

  import Notification from "../components/layout/Notification.svelte";

  export let segment;

  let notificationText = "";
  let notificationLevel = "success";

  setContext("notification", {
    createNotification
  });

  /**
   * Create a notification
   * @param {string} text Text to show
   * @param {'error' | 'success'} level Notification level
   **/
  function createNotification(text, level = "success") {
    notificationText = text;
    notificationLevel = level;
  }

  /**
   * Main element clicked
   * @param event Click event
   **/
  function mainClick(event) {
    if (event.target.nodeName === "BUTTON" || !notificationText) {
      return;
    }

    notificationText = "";
  }
</script>

<style>
  :global(html) {
    box-sizing: border-box;
  }

  :global(*) {
    box-sizing: inherit;
  }

  main {
    background-color: white;
    margin: 0 auto;
    max-width: 56em;
    padding: 2em;
    position: relative;
  }
</style>

<svelte:window on:click={mainClick} />

<main>
  {#if notificationText}
    <Notification text={notificationText} />
  {/if}

  <slot />
</main>
