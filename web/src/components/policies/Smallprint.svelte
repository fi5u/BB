<script>
  import PolicySheets from "./PolicySheets.svelte";

  export let key = "continue";

  let activePolicy = "";

  /**
   * Set current active policy
   * @param {string} policy Policy to activate
   **/
  function setActivePolicy(policy) {
    activePolicy = policy;
  }
</script>

{#if key === 'continue'}
  <p>
    By continuing, you agree to our
    <button on:click={() => setActivePolicy('terms')}>
      terms and conditions
    </button>
  </p>
{/if}

<PolicySheets {activePolicy} {setActivePolicy} />
