<template>
  <div>
      <nav>
        <div class="nav-wrapper">
          <ul id="nav-mobile" class="left">
            <li v-show="!logged"><a @click="signin"><i class="material-icons">account_circle</i></a></li>
            <li v-show="logged">
              <ul id="slide-out" class="sidenav">
                <li class="disabled"><a class="disabled" disabled>{{ fullName () }} 🇦🇷</a></li><br>
                <li><a @click="tareas">Tareas 📖</a></li>
                <li><a @click="settings">Configuración ⚙️</a></li>
                <li><a @click="logout">Cerrar sesión 🖕</a></li>
              </ul>

              <a class="sidenav-trigger but-nav" data-target="slide-out">
                <i class="material-icons">dehaze</i>
              </a>
            </li>
          </ul>
        </div>
      </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import service from './services/service'
import { mapState, mapGetters } from 'vuex'

export default {

  name: 'app',

  methods: {
    fullName () {
      if (!this._fullName) {
        const us = JSON.parse(localStorage.getItem('user'))
        if (us) {
          if (!us.username || !us.firstName || !us.lastName) {
            this.$router.push({ name: 'signin' })
            this.$store.commit('clearInfo')
            return
          }

          this.$store.commit('setUser', {
            username: us.username,
            firstName: us.firstName,
            lastName: us.lastName,
            email: us.email
          })

          this.$store.commit('logUser', true)
        }
      }

      return this._fullName
    },

    logout () {
      this.$router.push({ name: 'signin' })
      this.$store.commit('clearInfo')
      $('.sidenav').sidenav('close')
    },

    signin () {
      this.$router.push({ name: 'signin' })
      this.$store.commit('clearInfo')
    },

    tareas () {
      $('.sidenav').sidenav('close')
      return this.$router.push({ name: 'task' })
    },

    settings () {
      $('.sidenav').sidenav('close')
      const pa = this.getUserInfo
      if (pa) {
        this.$router.push({ name: 'settings', params: { username: pa.username } })
      } else {
        const us = JSON.parse(localStorage.getItem('user'))
        if (!us || !us.uername) {
          this.$toast.bottom('Algo ocurrió con tu sesión')
          this.$router.push({ name: 'signin' })
          this.$store.commit('clearInfo')
        } else {
          this.$router.push({ name: 'settings', params: { username: us.username } })
        }
      }
    }
  },

  async mounted () {
    $('.sidenav').sidenav()
    $('.modal').modal()

    const token = localStorage.getItem('token')
    if (!token) {
      this.$store.commit('clearInfo')
      return this.$router.push({ name: 'signin' })
    }

    if (this.logged) {
      if (!window.sessionStorage.logged) {
        if (this.getUserInfo) {

          const us = await service.getUsernameWithToken(this.username, token)
          if (!us) {
            this.$store.commit('clearInfo')
            return this.$router.push({ name: 'signin' })
          }

          return sessionStorage.setItem('logged', true)
        } else {
          const usu = JSON.parse(localStorage.getItem('user'))

          if (!usu || !usu.username) {
            this.$store.commit('clearInfo')
            return this.$router.push({ name: 'signin' })
          }

          const us = await service.getUsernameWithToken(usu.username, token)
          if (us.error) {
            this.$store.commit('clearInfo')
            this.$toast.bottom('Algo falló')
            return this.$router.push({ name: 'signin' })
          }

          return sessionStorage.setItem('logged', true)
        }
      }
    }

  },

  created () {
    if (this.userIsLogged) {
      this.fullName()
    }
  },

  computed: {
    ...mapState(['logged', 'username']),
    ...mapGetters(['getUserInfo', 'userIsLogged', '_fullName'])
  }

}
</script>

<style>
html {
  background-color: #f3f3f3;
}

.app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.logaso {
  margin-right: 15px;
}

nav {
  background-color: #4db883;
}

a.sidenav-trigger.but-nav {
  display: block;
  left: -20px;
}
</style>
