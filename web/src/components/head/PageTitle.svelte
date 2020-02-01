<script>
  import { name } from '../../../../config'

  export let title = ''
</script>

<svelte:head>
  <title>{title ? `${title} • ` : ''}{name}</title>
</svelte:head>
