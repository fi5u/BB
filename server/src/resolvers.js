module.exports = {
  Query: {
    me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findOrCreateUser(),
    user: (_, { email, fbId, id }, { dataSources }) =>
      dataSources.userAPI.findUser({ email, fbId, id }),
    users: async (_, __, { dataSources }) => dataSources.userAPI.getAllUsers(),
  },
  Mutation: {
    addUser: async (
      _,
      { email, fbId, name, password, salt },
      { dataSources }
    ) => {
      const user = await dataSources.userAPI.createUser({
        email,
        fbId,
        name,
        password,
        salt,
      })
      if (user) return user
    },
    updateUser: async (
      _,
      { email, id, name, password, passwordResetTime, salt },
      { dataSources }
    ) => {
      const user = await dataSources.userAPI.updateUser({
        email,
        id,
        name,
        password,
        passwordResetTime,
        salt,
      })
      if (user) return user
    },
    getUser: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findUser({ email })

      if (user) return user
    },
  },
}
