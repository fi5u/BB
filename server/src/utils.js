const SQL = require('sequelize')

module.exports.createStore = () => {
  const Op = SQL.Op
  const operatorsAliases = {
    $in: Op.in,
    $or: Op.or,
  }

  const db = new SQL('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './store.sqlite',
    operatorsAliases,
    logging: false,
  })

  const users = db.define('user', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    email: SQL.STRING,
    fbId: SQL.INTEGER,
    name: SQL.STRING,
    password: SQL.STRING,
    passwordResetTime: SQL.STRING,
    salt: SQL.STRING,
  })

  return { users }
}
