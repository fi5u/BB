<script>
  export let autocomplete = null;
  export let errorMessage;
  export let id;
  export let label;
  export let placeholder = null;
  export let type;
  export let value = null;

  let sharedProps = {
    autocomplete,
    id,
    label,
    placeholder,
    type
  };

  $: console.log(errorMessage);
</script>

{#if type === 'email'}
  <input {...sharedProps} bind:value type="email" />
{:else if type === 'password'}
  <input {...sharedProps} bind:value type="password" />
{:else}
  <input {...sharedProps} bind:value type="text" />
{/if}

{#if errorMessage}
  <p>Error: {errorMessage}</p>
{/if}
