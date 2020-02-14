<script>
  import { stores } from '@sapper/app'
  import { getContext } from 'svelte'

  import { log } from '../../utils/logging'
  import { languages } from '../../../../config'

  const { session } = stores()

  /**
   * Set the language on the session at server
   **/
  async function changeLanguage(language) {
    function failureNotification() {
      const notification = getContext('notification')
      notification.createNotification(
        'Oops, we couldn’t change the language, please try again.'
      )
    }

    await log.info('Begin language switch', { language })

    window.localStorage.setItem('langOverride', language)
    $session.langOverride = language

    window.location.href = `${window.location.pathname}?lang=${language}`
  }
</script>

<div>
  <h2>Other languages</h2>

  <ul>
    {#each languages.supported as l}
      <li>
        <button on:click={() => changeLanguage(l.code)}>{l.name}</button>
      </li>
    {/each}
  </ul>
</div>
