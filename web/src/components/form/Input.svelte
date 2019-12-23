<script>
  export let autocomplete;
  export let errorMessage = null;
  export let id;
  export let label;
  export let placeholder;
  export let type;
  export let value;

  let sharedProps = {
    autocomplete,
    id,
    label,
    oninput: handleUpdate,
    placeholder,
    type
  };

  /**
   * Handle input update
   */
  function handleUpdate() {
    if (errorMessage) {
      errorMessage = null;
    }
  }
</script>

<label for={sharedProps.id}>{sharedProps.label}</label>
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
