'use strict'

require('babel-polyfill')
module.exports = function setupTask (taskModel, userModel) {
  async function create(task) {
    const newTask = await taskModel.create(task)
    return newTask.toJSON()
  }

  function getTasks () {
    return taskModel.findAll({
      order: [
        ['id', 'DESC']
      ]
    })
  }

  async function getTasksByUsername (username) {
    return taskModel.findAll({
      where: {
        username
      },
      order: [
        ['id', 'DESC']
      ]
    })
  }

  function getTasksByUuid (uuid) {
    return taskModel.findOne({
      where: {
        uuid
      }
    })
  }

  function deleteTask (uuid) {
    return taskModel.destroy({
      where: {
        uuid
      }
    })
  }

  function deleteTaskByUsername (username) {
    return taskModel.destroy({
      where: {
        username
      }
    })
  }

  async function updateTask (task) {
    const t = await getTasksByUuid(task.uuid)

    if (t) {
      const up = await taskModel.update(task, {
        where: {
          uuid: task.uuid
        }
      })
    }
  }

  async function UpdateUsernameTask (oldUsername, newUsername) {
    const pa = await taskModel.update({ username: newUsername }, {
      where: {
        username: oldUsername
      }
    })
  }

  return {
    create,
    getTasks,
    getTasksByUsername,
    getTasksByUuid,
    deleteTask,
    updateTask,
    UpdateUsernameTask,
    deleteTaskByUsername
  }
}
