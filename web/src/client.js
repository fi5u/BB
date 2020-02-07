import * as sapper from '@sapper/app'
import { getLocaleFromNavigator, init, register } from 'svelte-i18n'
import { log } from './utils/logging'
import { defaultLanguage, getBestFitLang } from './utils/i18n'

// Determine language
const bestFitLang = getBestFitLang(getLocaleFromNavigator())
const localeCode = bestFitLang.replace('_', '-')

// Current fails to register if loaded from other file
register('en-GB', () => import('../static/lang/en-GB.json'))
register('en-US', () => import('../static/lang/en-US.json'))
register('fi', () => import('../static/lang/fi.json'))

// Initialize language
init({
  fallbackLocale: defaultLanguage,
  initialLocale: localeCode,
})

sapper.start({
  target: document.querySelector('#sapper'),
})

// Log route change
// Note: listening to popstate does not work
// need to poll
let currentPath = window.location.pathname

window.setInterval(async () => {
  if (window.location.pathname !== currentPath) {
    await log.info(`Route: ${window.location.pathname}`, {
      type: 'client',
    })

    currentPath = window.location.pathname
  }
}, 100)
