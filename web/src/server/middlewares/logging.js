const { serverLogging } = require('../../utils/logging')

module.exports = {
  /**
   * Log event
   */
  log: async (req, res) => {
    switch (req.method) {
      case 'POST': {
        return serverLogging(req, res)
      }
    }
  },
}