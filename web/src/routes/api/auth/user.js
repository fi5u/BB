import { getUser } from '../../../utils/auth'
import { log } from '../../../utils/logging'

export async function get(req, res) {
  if (req.session.user) {
    log.info('User in session')

    return res.json({
      user: req.session.user,
    }).status(200).end()
  }

  log.info('No user in session')

  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    log.error('Get user, not authorization headers')

    return res.end(JSON.stringify({
      user: null,
    }));
  }

  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');

  if (email && !password) {
    // Check for existance of email only
    req.session.savedEmail = email

    const userRecord = await getUser({ email })

    // Only return email, id and hasPassword
    const { email: emailRecord, id, password } = userRecord
    const user = { email: emailRecord, hasPassword: !!password, id }

    // Note: do not save this user to session
    // This is simply a check

    res.setHeader('Content-Type', 'application/json');

    return res.end(JSON.stringify({
      user
    }));
  }

  res.end(JSON.stringify({
    user: null,
  }));
}