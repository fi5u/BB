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

    log.info('Begin language switch', { language })

    try {
      const response = await fetch('/api/i18n/language', {
        body: JSON.stringify({ langOverride: language }),
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (response.status === 400) {
        log.error('Failed to switch language', { error: 'Bad response' })
        return failureNotification()
      }

      window.localStorage.setItem('langOverride', language)
      $session.langOverride = language

      await log.info('Language switch success', { language })

      window.location.reload()
    } catch (error) {
      failureNotification()

      log.error('Failed to switch language', { error: error.message })
    }
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
