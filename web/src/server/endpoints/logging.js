const { serverLogging } = require('server/utils/logging')

module.exports = {
  /**
   * Log event
   */
  log: async (req, res) => {
    switch (req.method) {
      case 'POST': {
        serverLogging(req)
        res.end()
      }
    }
  },
}
