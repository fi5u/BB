<script>
  export let values;

  import Input from "./Input.svelte";
</script>

{#each Object.keys(values) as inputValue}
  <Input
    bind:value={values[inputValue].value}
    placeholder={values[inputValue].placeholder} />
{/each}
