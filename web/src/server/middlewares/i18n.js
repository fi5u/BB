const { getBestFitLang, registerLanguages } = require('../../utils/i18n')

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

    // If language override set in session, use that
    req.locale =
      (req.locale = req.session.langOverride) ||
      getBestFitLang(req.headers['accept-language'])

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
