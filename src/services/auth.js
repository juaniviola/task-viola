import services from './service'

export default {
  logging (user) {
    return services.signin(user)
      .then(json => {
        const { token } = json
        const { username, firstName, lastName, email } = json
        const { error } = json

        if (!username) {
          return error
        }

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify({username, firstName, lastName, email}))

        return json
      })
      .catch(err => err)
  },

  signup (user) {
    return services.signup(user)
      .then(json => {
        const { token } = json
        const { username, firstName, lastName, email } = json

        if (!token || !user) {
          return console.log('error mano')
        }

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify({username, firstName, lastName, email}))
      })
  },

  updateUser (user, password, toke) {
    return services.updateUser(user, password, toke)
      .then(json => {
        const { token } = json
        const { username, firstName, lastName, email } = json

        if (!token || !user) {
          return json
        }

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify({username, firstName, lastName, email}))

        return json
      })
  },

  isLoggedIn () {
    return localStorage.getItem('token') !== null
  },

  logout () {
    localStorage.clear()
    sessionStorage.clear()
  },

  getToken () {
    return localStorage.getItem('token')
  },

  handleError (err) {
    const { error: { name }, message } = err
    if (name === 'TokenExpiredError') {
      console.log('token expired')
    } else if (name === 'JsonWebTokenError') {
      console.log('error in jwt')
    } else {
      console.log(message || 'hubo algun error wacho')
    }
  }
}
