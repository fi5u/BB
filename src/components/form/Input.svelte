<script>
  export let autocomplete = null;
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
</script>

{#if type === 'submit'}
  <button type="submit">{sharedProps.label}</button>
{:else if type === 'password'}
  <input {...sharedProps} bind:value type="password" />
{:else if type === 'email'}
  <input {...sharedProps} bind:value type="email" />
{:else}
  <input {...sharedProps} bind:value type="text" />
{/if}
