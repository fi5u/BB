<script>
  export let signupForm;

  import Input from "./Input.svelte";
</script>

{#each signupForm as item}
  <Input bind:value={item.value} {...item} />
{/each}
