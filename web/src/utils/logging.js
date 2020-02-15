import { serverLogging } from 'server/utils/logging'
import { service } from 'config'

const levels = ['info', 'error', 'warn']

// Build the exported log object
export const log = levels.reduce((acc, cur) => {
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
}, {})

/**
 *
 * @param {string} params.level Log level
 * @param {string} params.message Message
 * @param {object} params.extra Extra data to log
 */
async function logging(params) {
  await fetch(`${service.url}/api/logging`, {
    body: JSON.stringify(params),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
}

// Build the exported server log object
export const serverLog = levels.reduce((acc, cur) => {
  return {
    ...acc,
    [cur]: (req, message, extra, uId) =>
      serverLogging(req, {
        extra,
        level: cur,
        message,
        uId,
      }),
  }
}, {})
