const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  async createUser({ email, fbId, name, password, salt }) {
    if (email && !password && !salt && !isEmail.validate(email) || (!email && !fbId)) {
      console.log('Preventing create user..')
      return null
    };

    console.log('Creating:')
    console.log({ email, fbId, name, password, salt })

    const user = await this.store.users.create({ email, fbId, name, password, salt })

    return {
      id: user.id,
      email
    }
  }

  async updateUser({ email, id, name }) {
    console.log('updateUser()')
    if (!id) {
      console.log('Preventing update user..')
      return null
    }

    console.log('Updating:')
    console.log({ email, id, name })

    try {
      if (email) {
        // Check that email has not already been used in db
        const emailCheckUser = await this.store.users.findOne(
          { where: { email } }
        )

        if (emailCheckUser) {
          throw new Error('Cannot change email, already exists')
        }
      }

      const user = await this.store.users.findOne(
        { where: { id } }
      )

      if (!user) {
        throw Error(`User not updated. id: ${id}`);
      }

      if (email) {
        user.email = email
      }

      if (name) {
        user.name = name
      }

      await user.save();

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
    const user = await this.store.users.findOne({ where: { $or: { email, fbId, id } } });
    return user || null
  }

  async bookTrips({ launchIds }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }) {
    const userId = this.context.user.id;
    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId },
    });
    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;
    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.dataValues.launchId).filter(l => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId, launchId },
    });
    return found && found.length > 0;
  }

  async getAllUsers() {
    const users = await this.store.users.findAll()

    return users
  }
}

module.exports = UserAPI;
