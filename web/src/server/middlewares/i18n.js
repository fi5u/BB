const { getBestFitLang, registerLanguages } = require('utils/i18n')
const { serverLogging: log } = require('server/utils/logging')

/**
 * Determine is a file request
 * @param {string} path Path of route
 */
function isFileRequest(path) {
  const r = RegExp(/^.*\.[^\\]+$/)
  return r.test(path)
}

module.exports = {
  /**
   * Get the user langauge
   */
  determineLang: async (req, res, next) => {
    if (isFileRequest(req.path)) {
      return next()
    }

    if (req.query.lang) {
      const queryFitLang = getBestFitLang(req.query.lang)

      if (queryFitLang.replace('_', '-') === req.query.lang) {
        // Save to session
        req.session.langOverride = queryFitLang
      } else {
        // Only save language to session if it is the same
        // as languages available in app
        log(req, {
          extra: {
            language: req.query.lang,
          },
          level: 'info',
          message: `Custom language passed in url, not supported`,
        })
      }
    }

    // If language override set in session, use that
    req.locale =
      req.session.langOverride || getBestFitLang(req.headers['accept-language'])

    next()
  },

  /**
   * Register languages
   */
  registerLang: async (req, res, next) => {
    if (isFileRequest(req.path)) {
      return next()
    }

    registerLanguages(req.locale, '../../../static')

    next()
  },
}
