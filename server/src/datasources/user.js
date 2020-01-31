const { DataSource } = require('apollo-datasource')
const isEmail = require('isemail')

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
    if (!email || !isEmail.validate(email)) return null

    const users = await this.store.users.findOrCreate({ where: { email } })
    return users && users[0] ? users[0] : null
  }

  async createUser({ email, fbId, name, password, salt }) {
    if (
      (email && !password && !salt && !isEmail.validate(email)) ||
      (!email && !fbId)
    ) {
      return null
    }

    const user = await this.store.users.create({
      email,
      fbId,
      name,
      password,
      salt,
    })

    return {
      id: user.id,
      email,
    }
  }

  async updateUser({ email, id, name, password, passwordResetTime, salt }) {
    if (!id) {
      console.log('Preventing update user..')
      return null
    }

    try {
      if (email) {
        // Check that email has not already been used in db
        const emailCheckUser = await this.store.users.findOne({
          where: { email },
        })

        if (emailCheckUser) {
          throw new Error('Cannot change email, already exists')
        }
      }

      const user = await this.store.users.findOne({ where: { id } })

      if (!user) {
        throw Error(`User not updated. id: ${id}`)
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

      return {
        email: user.email,
        id: user.id,
        name: user.name,
      }
    } catch (error) {
      console.log('Error updating values:')
      console.log(error.message)
    }
  }

  async findUser({ email, fbId, id }) {
    const user = await this.store.users.findOne({
      where: { $or: { email, fbId, id } },
    })
    return user || null
  }

  async getAllUsers() {
    const users = await this.store.users.findAll()

    return users
  }
}

module.exports = UserAPI
