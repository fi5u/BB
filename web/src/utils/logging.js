const levels = ['info', 'error', 'warn']

// Build the exported log object
export const log = levels.reduce((acc, cur) => {
  return {
    ...acc,
    [cur]: (message, extra) => logging({
      extra,
      level: cur,
      message,
    })
  }
}, {})

/**
 *
 * @param {string} params.level Log level
 * @param {string} params.message Message
 * @param {object} params.extra Extra data to log
 */
function logging(params) {
  fetch('http://localhost:3000/api/logging', {
    body: JSON.stringify(params),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}