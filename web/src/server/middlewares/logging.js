const fs = require('fs')

module.exports = {
  /**
   * Log event
   */
  log: async (req, res) => {
    switch (req.method) {
      case 'POST': {
        const { extra = {}, level, message, uId } = req.body

        const d = new Date()
        const ua = req.headers['user-agent']

        extra.ua = extra.ua || ua

        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const logString = `${level.slice(0, 3).toUpperCase()} ${uId || 0}@${ip} [${d.toISOString()}] ${message} ${JSON.stringify(extra)}`

        if (process.env.NODE_ENV === 'development') {
          console.log(logString)
        } else {
          const stream = fs.createWriteStream(__dirname + '/../../../logs/debug.log', { flags: 'a' })
          stream.write(logString + '\n')
        }

        res.end()
      }
    }
  },
}