<script>
  import Button from 'components/form/Button.svelte'
  import Input from 'components/form/Input.svelte'

  export let form
  export let onsubmit
</script>

<form on:submit|preventDefault={onsubmit}>
  {#each form as item}
    {#if item.type === 'submit'}
      <Button {...item} />
    {:else}
      <Input
        bind:errorMessage={item.errorMessage}
        bind:value={item.value}
        {...item}
      />
    {/if}
  {/each}
</form>
