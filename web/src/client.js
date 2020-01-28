import * as sapper from '@sapper/app'
import { log } from './utils/logging'

sapper.start({
  target: document.querySelector('#sapper'),
})

let currentPath = window.location.pathname

// Log route change
// Note: listening to popstate does not work
// need to poll
window.setInterval(async () => {
  if (window.location.pathname !== currentPath) {
    await log.info(`Route: ${window.location.pathname}`, {
      type: 'client',
    })

    currentPath = window.location.pathname
  }
}, 100)
