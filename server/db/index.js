'use strict'

require('babel-polyfill')
const setupDatabase = require('./lib/db')
const setupUserModel = require('./models/user')
const setupTaskModel = require('./models/task')
const setupUser = require('./lib/user')
const setupTask = require('./lib/task')
// const Debug = require('debug')

module.exports = async function (config) {
  const sequelize = setupDatabase(config)
  const UserModel = setupUserModel(config)
  const TaskModel = setupTaskModel(config)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true, logging: console.log })
  }

  const User = setupUser(UserModel)
  const Task = setupTask(TaskModel, UserModel)

  return {
    User,
    Task
  }
}
