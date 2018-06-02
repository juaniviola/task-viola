import rp from 'request-promise'
import config from './config'

export default {
  getTaskByUuid (uuid) {
    const options = {
      method: 'GET',
      uri: `${config.apiUrl}/task/${uuid}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      json: true
    }

    return rp(options)
      .then(task => task)
      .catch(err => err)
  },

  getTaskByUsername (username, token) {
    const options = {
      method: 'GET',
      uri: `${config.apiUrl}/task/get/${username}?token=${token}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      json: true
    }

    return rp(options)
      .then(task => task)
      .catch(err => err)
  },

  addTask (task, token) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/task/add?token=${token}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        task
      },
      json: true
    }

    return rp(options)
      .then(j => j)
      .catch(err => err)
  },

  deleteTask (uuid, token) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/task/delete?token=${token}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        uuid
      },
      json: true
    }

    return rp(options)
      .then(t => t)
      .catch(err => err)
  },

  updateTasks (task, token) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/task/update?token=${token}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        task
      },
      json: true
    }

    return rp(options)
      .then(t => t)
      .catch(err => err)
  }
}
