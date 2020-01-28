import * as sapper from '@sapper/app'
import { log } from './utils/logging'

sapper.start({
  target: document.querySelector('#sapper'),
})

let currentPath = window.location.href

// Log route change
// Note: listening to popstate does not work
// need to poll
window.setInterval(async () => {
  if (window.location.href !== currentPath) {
    await log.info(`Route: ${window.location.href}`, {
      type: 'client',
    })

    currentPath = window.location.href
  }
}, 100)
