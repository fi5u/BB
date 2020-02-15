import { session as sessionConfig } from 'config'
import { serverLog } from 'utils/logging'

export async function post(req, res) {
  const uId = req.session && req.session.user && req.session.user.id

  if (req.session) {
    try {
      // Note: req.session.destroy() causes errors for next session
      // need to nullify each individually
      sessionConfig.ids.forEach(id => {
        req.session[id] = null
      })
    } catch (error) {
      await serverLog.error(
        req,
        'Logout failed to clear session',
        { error: error.message },
        uId
      )
    }
  }

  // NOTE: if log before deleting session user,
  // causes strange auto-relogin bug
  await serverLog.info(req, 'Logout', {}, uId)

  res.end(JSON.stringify({ ok: true }))
}
