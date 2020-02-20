import { getUser, generatePasswordHash, updateUser } from 'utils/auth'
import { log } from 'utils/logging'

function bail(res) {
  res.setHeader('Content-Type', 'application/json')
  return res.end(
    JSON.stringify({
      user: null,
    })
  )
}

/**
 * Get user record
 * @param {string} id User ID
 * @param {object} req Request object
 */
async function getUserRecord(req, id) {
  const userRecord = await getUser({ id })

  if (userRecord) {
    return userRecord
  }

  printToLog(req, 'no user record returned', 'warn')
}

/**
 * Print to log
 * @param {object} req Request object
 * @param {string} message Log message
 * @param {string} level Log level
 */
function printToLog(req, message = '', level = 'info', extra = {}) {
  log[level](
    `${req.method === 'PUT' ? 'Update' : 'Get'} user${
      message ? `, ${message}` : ''
    }`,
    {
      ...req.params,
      ...extra,
    }
  )
}

/**
 * Verify that email and password in auth headers match records
 * @param {object} req Request object
 * @param {object} userRecord User record object
 */
async function verifyAuth(req, userRecord) {
  const base64Credentials = req.headers.authorization.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [email, password] = credentials.split(':')

  if (!email || !password) {
    printToLog(
      req,
      `trying to authorize but missing${!email && ' email'}${!password &&
        ' password'}`
    )

    return false
  }

  if (email !== userRecord.email) {
    printToLog(req, 'trying to authorize but email does not match', 'info', {
      email,
      emailRecord: userRecord.email,
    })

    return false
  }

  const passwordHashed = await generatePasswordHash(password)
  if (userRecord.password !== passwordHashed) {
    printToLog(req, 'trying to authorize but password does not match', 'info', {
      email,
    })

    return false
  }

  return true
}

function verifyAuthHeadersExist(req, isError = false) {
  if (
    req.headers.authorization &&
    req.headers.authorization.indexOf('Basic ') > -1
  ) {
    return true
  }

  printToLog(req, 'no authorization headers passed', isError ? 'error' : 'info')
}

/**
 * Verify that the passed ID is correctly formed
 * @param {object} req Request object
 */
function verifyId(req) {
  const { id } = req.params

  if (id && !isNaN(id)) {
    return true
  }

  printToLog(req, !id ? 'no ID passed' : 'invalid ID passed', 'error')
}

/**
 * Get a user by ID
 * @param {object} req Request object
 * @param {object} res Response object
 */
export async function get(req, res) {
  printToLog(req)

  if (!verifyId(req)) {
    return bail(res)
  }

  const { id } = req.params

  const userRecord = await getUserRecord(req, id)

  if (!userRecord) {
    return bail()
  }

  let hasAuthorization = true

  // Can acceess limited data without authorization
  if (!verifyAuthHeadersExist(req)) {
    hasAuthorization = false
  }

  if (hasAuthorization) {
    // Verify the auth headers
    hasAuthorization = await verifyAuth(req, userRecord)
  }

  let user = {}

  if (hasAuthorization) {
    const { email: emailRecord, fbId, id, name, password, salt } = userRecord

    user = {
      email: emailRecord,
      hasFBLogin: !!fbId,
      hasPassword: !!password,
      id,
      name,
      password,
      salt,
    }

    // Save has password and fb login status to session
    req.session.hasPassword = !!password
    req.session.hasFBLogin = !!fbId

    // Save user to session
    req.session.user = user
  } else {
    user = {
      id,
    }
  }

  res.setHeader('Content-Type', 'application/json')
  return res.end(
    JSON.stringify({
      user,
    })
  )
}

/**
 * Update a user by ID
 * @param {object} req Request object
 * @param {object} res Response object
 */
export async function put(req, res) {
  printToLog(req)

  if (!verifyId(req) || !verifyAuthHeadersExist(req)) {
    return bail(res)
  }

  if (
    !req.body ||
    (Object.keys(obj).length === 0 && obj.constructor === Object)
  ) {
    printToLog(req, 'no values passed to update', 'error', req.params)
    return bail(res)
  }

  const { id } = req.params

  const userRecord = await getUserRecord(req, id)

  if (!userRecord) {
    return bail()
  }

  if (!(await verifyAuth(req, userRecord))) {
    return bail(res)
  }

  const { error, user } = updateUser(req.body)

  if (error || !user) {
    printToLog(req, 'no updated user returned')
    return bail()
  }

  res.setHeader('Content-Type', 'application/json')
  return res.end(
    JSON.stringify({
      user,
    })
  )
}
