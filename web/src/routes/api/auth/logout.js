import { log } from '../../../utils/logging'

export function post(req, res) {
  log.info('Logout')

  delete req.session.user

  res.end(JSON.stringify({ ok: true }))
}