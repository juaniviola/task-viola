import rp from 'request-promise'
import config from './config'

function handleFatalError (err) {
  console.log(err.message)
  console.log(err.stack)
}

export default {
  signin (user) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/auth/signin`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        user
      },
      json: true
    }

    return rp(options)
      .then(json => json)
      .catch(err => err)
  },

  signup (user) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/auth/signup`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        user
      },
      json: true
    }

    return rp(options)
      .then(json => json)
      .catch(err => err)
  },

  Delete (username, password, token) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/auth/deleteuser?token=${token}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        username,
        password
      },
      json: true
    }

    return rp(options)
      .then(usr => usr)
      .catch(err => err)
  },

  getUserByUsername (username) {
    const options = {
      method: 'GET',
      uri: `${config.apiUrl}/auth/getuserbyusername/${username}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      json: true
    }

    return rp(options)
      .then(user => user)
      .catch(err => err)
  },

  getUserByEmail (email) {
    const options = {
      method: 'GET',
      uri: `${config.apiUrl}/auth/getuserbyemail/${email}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      json: true
    }

    return rp(options)
      .then(usr => usr)
      .catch(err => err)
  },

  getUsernameWithToken (username, token) {
    const options = {
      method: 'GET',
      uri: `${config.apiUrl}/auth/getuserbyusernamet/${username}?token=${token}`,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      json: true
    }

    return rp(options)
      .then(usr => usr)
      .catch(err => err)
  },

  updateUser (user, password, token) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/auth/update?token=${token}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        user,
        password
      },
      json: true
    }

    return rp(options)
      .then(json => json)
      .catch(err => err)
  },

  passwordUpdate (oldPassword, newPassword, token) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/auth/password?token=${token}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        oldPassword,
        newPassword
      },
      json: true
    }

    return rp(options)
      .then(json => json)
      .catch(err => err)
  },

  recover (username, email) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/auth/recover`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        username,
        email
      },
      json: true
    }

    return rp(options)
      .then(json => json)
      .catch(err => err)
  },

  updatePassword (username, password, id) {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/auth/recoverpass`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: {
        username,
        password,
        id
      },
      json: true
    }

    return rp(options)
      .then(json => json)
      .catch(err => err)
  }
}
