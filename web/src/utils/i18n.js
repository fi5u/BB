import { init, register } from 'svelte-i18n'
import locale from 'locale'
import { languages } from '../../../config'

const supportedLanguages = languages.supported.map(l =>
  l.code.replace('-', '_')
)
export const defaultLanguage = languages.default.replace('-', '_')

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
  const localeCode = userLang.replace('_', '-')

  // Register each supported language
  languages.supported.forEach(l =>
    register(l.code, () => import(`${staticPath}/lang/${l.code}.json`))
  )

  // Initialize
  init({
    fallbackLocale: defaultLanguage,
    initialLocale: localeCode,
  })
}
