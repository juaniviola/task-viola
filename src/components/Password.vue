<template>
<div>
  <div class="container">
    <div class="row">
      <div class="col s12">
        <div v-show="loading" class="centrado">
          <loader></loader>
        </div>

        <div v-show="!success && logged && !loading && !error">
          <div class="centrado">
            <span>No debes estar logueado.</span> <br>
            <button class="waves-effect waves-light btn" @click="volver"><i class="material-icons left">arrow_left</i>Volver</button>
          </div>
        </div>

        <div v-show="!success && !logged && !loading">
          <div class="centrado">
            <i class="material-icons">account_circle</i>

            <form @submit.prevent="enviar">
              <div class="centrado">
                <p>
                  Te enviaremos un correo electrónico para que puedas
                  recuparar tu contraseña. <br>
                  Esto puede tardar unos minutos...
                </p>
              </div>

              <div v-show="error" class="centrado warning">
                <span>{{ errorMessage }}</span>
              </div>

              <div class="input-field col s12">
                <input type="text" name="username" v-model="username" required>
                <label for="username">Username</label>
              </div>

              <div class="input-field col s12">
                <input type="email" name="email" v-model="email" required>
                <label for="email">Email</label>
              </div>

              <div class="centrado">
                <button class="waves-effect waves-light btn" type="submit"><i class="material-icons left">send</i>Enviar</button>
              </div>
            </form>
          </div>
        </div>

        <div v-show="success && !loading" class="centrado">
          <i class="material-icons">account_circle</i> <br>
          <div class="success mina">
            <span>Correo enviado exitosamente 😃</span> <br>
            <span>Revisa tu bandeja de entrada para recuperar tu password.</span> <br>
          </div>
          <button class="waves-effect waves-light btn awa" @click="volver"><i class="material-icons left">arrow_left</i>Volver</button>
        </div>

      </div>
    </div>
  </div>
</div>
</template>

<script>
import service from '../services/service'
import auth from '../services/auth'
import Loader from '../components/shared/Loader.vue'
import { mapState } from 'vuex'

export default {
  components: { Loader },

  data () {
    return {
      username: '',
      email: '',
      error: false,
      errorMessage: '',
      loading: false,
      success: false
    }
  },

  methods: {
    async enviar () {
      this.loading = true
      const send = await service.recover(this.username, this.email)

      if (send.error) {
        this.success = false
        this.error = true
        this.errorMessage = send.error.message
        this.loading = false
      } else {
        this.error = false
        this.success = true
        this.loading = false
      }
    },

    volver () {
      this.$router.push({ name: 'task' })
    }
  },

  created () {
    this.loading = true
    this.loading = false
  },

  mounted () {
    const token = auth.getToken()
    if (!token) {
      this.$store.commit('logUser', false)
    }
  },

  computed: {
    ...mapState(['logged'])
  }
}
</script>

<style scoped>
  .centrado {
    text-align: center;
    margin-top: 60px;
    margin-bottom: 60px;
  }

  .centrado button {
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

  .success {
    padding: 10px;
    color: black;
    margin-bottom: 60px;
    margin-top: 60px;
    border-radius: 5px;
  }

  .centrado .awa {
    margin-top: 0px;
  }
</style>

