const { DataSource } = require('apollo-datasource')
const isEmail = require('isemail')
const { log } = require('../utils/logging')

class UserAPI extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg

    log.info('Find or create user', { email })

    if (!email || !isEmail.validate(email)) {
      if (!email) {
        log.info('Failed to find or create user', {
          error: 'No email passed or in context',
        })
      } else {
        log.info('Failed to find or create user', {
          email,
          error: 'Invalid email',
        })
      }

      return null
    }

    const users = await this.store.users.findOrCreate({ where: { email } })

    if (users && users[0]) {
      log.info('Found or created user', { email }, users[0].id)

      return users[0]
    } else {
      log.info('Failed to find or create user', {
        email,
        error: 'Unknown error',
      })

      return null
    }
  }

  async createUser({ email, fbId, name, password, salt }) {
    log.info('Create user', { email, fbId, name })

    if (
      (email && !password && !salt && !isEmail.validate(email)) ||
      (!email && !fbId)
    ) {
      if (email && !password && !salt && !isEmail.validate(email)) {
        log.info('Failed to create user', { email, error: 'Invalid email' })
      } else {
        log.info('Failed to create user', { error: 'No email or FBID passed' })
      }

      return null
    }

    const user = await this.store.users.create({
      email,
      fbId,
      name,
      password,
      salt,
    })

    log.info(
      'Created user',
      {
        id: user.id,
        email,
      },
      user.id
    )

    return {
      id: user.id,
      email,
    }
  }

  async updateUser({ email, id, name, password, passwordResetTime, salt }) {
    log.info('Updating user', { email, id, name, passwordResetTime, salt })

    if (!id) {
      log.info('Failed to update user', { error: 'No id passed', email })

      return null
    }

    if (email) {
      // Check that email has not already been used in db
      const emailCheckUser = await this.store.users.findOne({
        where: { email },
      })

      if (emailCheckUser) {
        log.info(
          'Failed to update email',
          { email, error: 'Email already exists' },
          id
        )

        return null
      }
    }

    const user = await this.store.users.findOne({ where: { id } })

    if (!user) {
      log.error('Failed to update user', { email, error: 'No user found' }, id)

      return null
    }

    if (email) {
      user.email = email
    }

    if (name) {
      user.name = name
    }

    if (password) {
      user.password = password
    }

    if (passwordResetTime || passwordResetTime === '') {
      user.passwordResetTime = passwordResetTime
    }

    if (salt) {
      user.salt = salt
    }

    await user.save()

    log.info('Updated user', { email, id, name }, id)

    return {
      email: user.email,
      id: user.id,
      name: user.name,
    }
  }

  async findUser({ email, fbId, id }) {
    log.info('Finding user', { email, fbId, id })

    const user = await this.store.users.findOne({
      where: { $or: { email, fbId, id } },
    })

    log.info(!user ? 'No user found' : 'Found user', { email, fbId, id })

    return user || null
  }

  async getAllUsers() {
    log.info('Getting all users')

    const users = await this.store.users.findAll()

    return users
  }
}

module.exports = UserAPI
