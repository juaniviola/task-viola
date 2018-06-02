<template>
  <div>
    <div class="centrado">
      <span><i class="material-icons">account_circle</i></span>
    </div>

    <div v-show="loading" class="marg">
      <loader></loader>
    </div>

    <div v-show="logged && !loading">
      <div class="centrado">
        <strong>Ya estas logueado 😸</strong><br>
        <button @click="volver" class="waves-effect waves-light btn botoneitor"><i class="material-icons left">arrow_back</i>Volver</button>
      </div>
    </div>

    <div v-show="!loading && !logged" class="marg">
      <div class="container">
        <div class="row">
          <div class="centrado warning" v-show="error">
            <strong>{{ errorMessage }}</strong>
          </div>
          <form v-on:submit.prevent="sendUser">
            <div class="input-field col s12">
              <input type="text" name="username" id="username" v-model="username" required>
              <label for="username">Username</label>
            </div>

            <div class="input-field col s12">
              <input type="text" name="firstName" v-model="firstName" required>
              <label for="firstName">Nombre</label>
            </div>

            <div class="input-field col s12">
              <input type="text" name="lastName" v-model="lastName" required>
              <label for="lastName">Apellido</label>
            </div>

            <div class="input-field col s12">
              <input type="password" name="password" v-model="password" required>
              <label for="password">Contraseña</label>
            </div>

            <div class="input-field col s12">
              <input type="email" name="email" v-model="email" required>
              <label for="email">Email</label>
            </div>

            <div class="centrado cen-buts">
              <button id="enviar" class="btn waves-effect waves-light enviar" type="submit"><i class="material-icons left">send</i>Registrar</button>
              <a class="btn waves-effect waves-light enviar" @click="volver"><i class="material-icons left">arrow_back</i>Volver</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import services from '../services/service'
  import Loader from './shared/Loader.vue'
  import auth from '../services/auth'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'SignUp',

    components: { Loader },

    data () {
      return {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        errorMessage: '',
        loading: false,
        error: false
      }
    },

    methods: {
      ...mapActions(['_signup']),

      async sendUser () {
        const user = {
          username: this.username,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password
        }

        this.loading = true
        this.error = false
        const us = await services.getUserByUsername(user.username)
        const em = await services.getUserByEmail(user.email)

        // email
        if (em) {
          this.error = true
          this.errorMessage = 'El email ya está registrado.'
          this.loading = false
          return
        } else {
          this.error = false
          this.loading = false
        }

        // user
        if (us) {
          this.error = true
          this.errorMessage = 'El username ya existe.'
          this.loading = false
          return
        } else {
          this.error = false
          this.loading = false
        }

        this.error = false
        this.loading = true
        await this._signup(user)
        this.loading = false

        this.$router.push({ name: 'task' })
      },

      volver () {
        this.$router.push({ name: 'task' })
      },

      salir () {
        this.$store.commit('logUser', false)
        this.$store.commit('clearInfo')
        this.$router.push({ name: 'signin' })
      }
    },

    computed: {
      ...mapState(['logged'])
    },

    mounted () {
      const token = auth.getToken()
      if (!token) {
        this.$store.commit('clearInfo')
      }

      document.getElementById('username').focus()
    }
  }
</script>

<style scoped>
  button.enviar {
    margin-bottom: 60px;
    margin-top: 60px;
  }

  .centrado {
    text-align: center;
    margin-top: 60px;
  }

  .centrado .botoneitor {
    margin-top: 60px;
  }

  .warning {
    padding: 10px;
    background-color: red;
    color: white;
    margin-bottom: 60px;
    margin-top: 60px;
    border-radius: 5px;
  }

  .app {
    margin-top: 60px;
    margin-bottom: 60px;
  }

  .marg {
    margin-top: 60px;
  }
</style>

