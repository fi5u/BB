<script>
  export let form;
  export let onsubmit;

  import Button from "./Button.svelte";
  import Input from "./Input.svelte";
</script>

<form on:submit={onsubmit}>
  {#each form as item}
    {#if item.type === 'submit'}
      <Button {...item} />
    {:else}
      <Input bind:value={item.value} {...item} />
    {/if}
  {/each}
</form>
