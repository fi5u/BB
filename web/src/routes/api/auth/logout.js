import { serverLog } from '../../../utils/logging'

export async function post(req, res) {
  const uId = req.session.user.id

  delete req.session.user

  // NOTE: if log before deleting session user,
  // causes strange auto-relogin bug
  await serverLog.info(req, res, 'Logout', {}, uId)

  res.end(JSON.stringify({ ok: true }))
}