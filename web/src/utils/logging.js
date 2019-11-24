const levels = ['info', 'error', 'warn']

// Build the exported log object
export const log = levels.reduce((acc, cur) => {
  return {
    ...acc,
    [cur]: (message, extra, uId) => logging({
      extra,
      level: cur,
      message,
      uId,
    })
  }
}, {})

/**
 *
 * @param {string} params.level Log level
 * @param {string} params.message Message
 * @param {object} params.extra Extra data to log
 */
async function logging(params) {
  if (typeof window !== 'undefined') {
    console.log('USER:')
    console.log(window.localStorage.getItem('user'))
  }

  await fetch('http://localhost:3000/api/logging', {
    body: JSON.stringify(params),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
  })
}

// Build the exported server log object
export const serverLog = levels.reduce((acc, cur) => {
  return {
    ...acc,
    [cur]: (req, res, message, extra, uId) => serverLogging(req, res, {
      extra,
      level: cur,
      message,
      uId
    })
  }
}, {})

export function serverLogging(req, res, params) {
  const { extra = {}, level, message, uId } = params || req.body
  const isDev = process.env.NODE_ENV === 'development'

  const d = new Date()

  if (!isDev) {
    const ua = req.headers['user-agent']
    extra.ua = extra.ua || ua
  }

  let userId = uId
  if (!userId && req && req.session && req.session.user) {
    userId = req.session.user.id
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  const logString = `${level.slice(0, 3).toUpperCase()} ${userId || 0}@${ip} [${d.toISOString()}] ${message} ${JSON.stringify(extra)}`

  if (process.env.NODE_ENV === 'development') {
    console.log(logString)
  } else {
    const stream = fs.createWriteStream(__dirname + '/../../../logs/debug.log', { flags: 'a' })
    stream.write(logString + '\n')
  }

  res.end()
}