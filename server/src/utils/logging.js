const fs = require('fs')

const levels = ['info', 'error', 'warn']

function logging(params) {
  const { extra = {}, level, message, uId } = params
  const isDev = process.env.NODE_ENV === 'development'

  const d = new Date()

  const logString = `${level.slice(0, 3).toUpperCase()} ${uId ||
    0}@- [${d.toISOString()}] ${message} ${JSON.stringify(extra)}`

  if (isDev) {
    console.log(logString)
  } else {
    const stream = fs.createWriteStream(
      __dirname + '/../../../logs/debug.log',
      {
        flags: 'a',
      }
    )
    stream.write(logString + '\n')
  }
}

module.exports = {
  // Build the exported log object
  log: levels.reduce((acc, cur) => {
    return {
      ...acc,
      [cur]: (message, extra, uId) =>
        logging({
          extra,
          level: cur,
          message,
          uId,
        }),
    }
  }, {}),
}
