'use strict'

require('babel-polyfill')
module.exports = function setupUser (UserModel) {
  async function create(user) {
    const newUser = await UserModel.create(user)
    return newUser.toJSON()
  }

  function findAll () {
    return UserModel.findAll()
  }

  function findById (id) {
    return UserModel.findOne({
      where: { id }
    })
  }

  function findByUsername (username) {
    return UserModel.findOne({
      where: {
        username
      }
    })
  }

  function findByEmail (email) {
    return UserModel.findOne({
      where: {
        email
      }
    })
  }

  async function updateUser (user, username) {
    const u = await findByUsername(username)

    if (u) {
      const updated = await UserModel.update(user, {
        where: {
          username
        }
      })

      return updated
    }
  }

  async function updatePassword (username, password) {
    const updated = await UserModel.update({ password }, {
      where: {
        username
      }
    })

    return updated
  }

  function deleteUserByUsername (username) {
    return UserModel.destroy({
      where: {
        username
      }
    })
  }

  // TODO: function update manito

  return {
    create,
    findAll,
    findById,
    findByUsername,
    findByEmail,
    deleteUserByUsername,
    updateUser,
    updatePassword
  }
}
