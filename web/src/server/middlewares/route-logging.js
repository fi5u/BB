const { serverLogging: log } = require('../utils/logging')

module.exports = {
  /**
   * Log route access
   */
  routeLog: async (req, res, next) => {
    const url = req.url

    if (
      url.indexOf('/api') === 0 ||
      (url.indexOf('.') > -1 &&
        (url.lastIndexOf('.') === url.length - 3 ||
          url.lastIndexOf('.') === url.length - 4 ||
          url.lastIndexOf('.') === url.length - 5))
    ) {
      // Do not log file access
      return next()
    }

    log(req, {
      extra: {
        type: 'server',
      },
      level: 'info',
      message: `Route: ${req.url}`,
    })

    next()
  },
}
