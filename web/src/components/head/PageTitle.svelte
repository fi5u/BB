<script>
  import { service } from '../../../../config'

  export let title = ''
</script>

<svelte:head>
  <title>{title ? `${title} • ` : ''}{service.name}</title>
</svelte:head>
