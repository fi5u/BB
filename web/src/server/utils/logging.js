import fs from 'fs'

// TODO: go back and remove res from all serverLog calls
export function serverLogging(req, params) {
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

  const logString = `${level.slice(0, 3).toUpperCase()} ${userId ||
    0}@${ip} [${d.toISOString()}] ${message} ${JSON.stringify(extra)}`

  if (process.env.NODE_ENV === 'development') {
    console.log(logString)
  } else {
    const stream = fs.createWriteStream(
      __dirname + '/../../../../logs/debug.log',
      { flags: 'a' }
    )
    stream.write(logString + '\n')
  }
}
