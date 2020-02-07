import { init, register } from 'svelte-i18n'
import locale from 'locale'

const supportedLanguages = ['en_GB', 'en_US', 'fi']
export const defaultLanguage = 'en_US'

/**
 * Determine the best language for the user out of the supported languages
 * @param {string} acceptLanguage User's current language
 */
export function getBestFitLang(acceptLanguage) {
  const supported = new locale.Locales(supportedLanguages, defaultLanguage)

  return new locale.Locales(acceptLanguage).best(supported).toString()
}

/**
 * Register languages
 * @param {string} userLang User language
 * @param {string} staticPath Path to static dir
 */
export function registerLanguages(userLang, staticPath) {
  // const defaultLangCode = defaultLanguage.replace('_', '-')
  const localeCode = userLang.replace('_', '-')

  register('en-GB', () => import(`${staticPath}/lang/en-GB.json`))
  register('en-US', () => import(`${staticPath}/lang/en-US.json`))
  register('fi', () => import(`${staticPath}/lang/fi.json`))

  // Initialize
  init({
    fallbackLocale: defaultLanguage,
    initialLocale: localeCode,
  })
}
