<script>
  export let form;
  export let onsubmit;

  import Button from "./Button.svelte";
  import Input from "./Input.svelte";

  console.log(form);
</script>

<form on:submit={onsubmit}>
  {#each form as item}
    {#if item.type === 'submit'}
      <Button {...item} />
    {:else}
      <Input
        bind:errorMessage={item.errorMessage}
        bind:value={item.value}
        {...item} />
    {/if}
  {/each}
</form>
