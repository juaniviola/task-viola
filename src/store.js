import Vue from 'vue'
import Vuex from 'vuex'

import Task from './services/task'
import Auth from './services/auth'
import service from './services/service'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    tasks: [],
    logged: false
  },

  getters: {
    getUserInfo (state) {
      if (state.username === '' || state.firstName === '' || state.lastName === '' || state.email === '') { return undefined }

      const user = {
        username: state.username,
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        age: state.age
      }

      return user
    },

    getUsername (state) {
      if (state.username === '') { return undefined }

      return state.username
    },

    getTasks (state) {
      if (state.tasks.length === 0) { return undefined }
      return state.tasks
    },

    userIsLogged (state) {
      return state.logged
    },

    _fullName (state) {
      if (state.firstName === '' || state.lastName === '' || state.logged === false) { return undefined }

      return `${state.firstName} ${state.lastName}`
    }
  },

  mutations: {
    setTasks (state, tasks) {
      state.tasks = tasks
    },

    deleteTaskByUuid (state, _uuid) {
      const pa = state.tasks.find(({ uuid }) => uuid === _uuid)
      const i = state.tasks.indexOf(pa)
      state.tasks.splice(i, 1)
    },

    _addTask (state, payload) {
      state.tasks.unshift(payload)
    },

    upTask (state, payload) {
      const pa = state.tasks.find((s) => s.uuid === payload.uuid)
      const i = state.tasks.indexOf(pa)
      state.tasks[i].name = payload.name
      state.tasks[i].description = payload.description
    },

    clearInfo (state) {
      state.tasks = []
      state.username = ''
      state.firstName = ''
      state.lastName = ''
      state.email = ''
      state.age = ''
      state.logged = false
      Auth.logout()
    },

    setUser (state, user) {
      state.username = user.username
      state.firstName = user.firstName
      state.lastName = user.lastName
      state.email = user.email
    },

    logUser (state, estado) {
      state.logged = estado
    }
  },

  actions: {
    getTasksByUsername (context, payload) {
      return Task.getTaskByUsername(payload.username, payload.token)
        .then(res => {
          if (res.length === 0 || res.error) {
            return res
          }

          context.commit('setTasks', res)
          return res
        })
    },

    deleteTasks (context, payload) {
      context.commit('deleteTaskByUuid', payload.uuid)

      return Task.deleteTask(payload.uuid, payload.token)
        .then(res => {
          return res
        })
    },

    addTasks (context, payload) {
      return Task.addTask(payload.task, payload.token)
        .then(res => {
          if (!res.error) {
            context.commit('_addTask', res.task)
            return res
          }

          return res
        })
    },

    _updateTask (context, payload) {
      context.commit('upTask', {
        uuid: payload.tarea.uuid,
        name: payload.tarea.name,
        description: payload.tarea.description
      })

      return Task.updateTasks(payload.tarea, payload.token)
        .then(res => {
          return res
        })
    },

    _getUser (context, username) {
      return service.getUserByUsername(username)
        .then(usr => {
          if (!usr.error) {
            context.commit('setUser', usr)
            return usr
          }

          return usr
        })
    },

    _logUser (context, estado) {
      return context.commit('logUser', estado)
    },

    _logging (context, user) {
      return Auth.logging(user)
        .then(usr => {
          if (!usr.error) {
            context.commit('setUser', usr)
            context.commit('logUser', true)
            return usr
          }

          return usr
        })
        .catch(err => err)
    },

    _signup (context, user) {
      return Auth.signup(user)
        .then(usr => {
          if (!usr.error) {
            context.commit('setUser', usr)
            context.commit('logUser', true)
            return usr
          }

          return usr
        })
        .catch(err => err)
    },

    _deleteUser (context, payload) {
      return service.Delete(payload.username, payload.password, payload.token)
        .then(json => {
          if (!json.error) {
            context.commit('clearInfo')
            return json
          }
          return json
        })
    },

    _updateUser (context, payload) {
      return Auth.updateUser(payload.user, payload.password, payload.token)
        .then(res => {
          if (!res.error) {
            context.commit('setUser', {
              username: res.username,
              firstName: res.firstName,
              lastName: res.lastName,
              email: res.email,
              age: res.age
            })

            context.commit('setTasks', [])
            return res
          }

          return res
        })
    }
  }
})

export default store
