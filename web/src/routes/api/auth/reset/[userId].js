import { getUser } from '../../../../utils/auth'
import { log } from '../../../../utils/logging'

export async function get(req, res) {
  const { userId } = req.params;

  let reason = ''

  log.info('Get password reset access', { userId })

  try {
    const userRecord = await getUser({ id: parseInt(userId) })

    if (!userRecord.id) {
      throw new Error('No user')
    }

    if (!userRecord.passwordResetTime) {
      throw new Error('Password reset not requested')
    }

    const resetTime = parseInt(userRecord.passwordResetTime)

    if (isNaN(resetTime)) {
      throw new Error('Reset time incorrectly formed')
    }

    const elapsedMs = Date.now() - resetTime

    // Do not permit if greater than one hour
    if (elapsedMs / 1000 / 60 / 60 > 1) {
      reason = 'expired'
      throw new Error('Link expired')
    }

    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify({
      email: userRecord.email,
      isPermitted: true
    }))
  } catch (error) {
    log.info('Get password reset access', { error: error.message })

    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify({
      reason,
      isPermitted: false
    }))
  }
}