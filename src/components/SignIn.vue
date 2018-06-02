<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col s12">
          <div class="centrado spani">
            <span><i class="material-icons">account_circle</i></span>
          </div>

          <div v-show="loading" class="marg"><loader></loader></div>

          <div v-show="logged" class="marg">
            <div class="centrado">
              <strong>Ya estas logueado 😸</strong><br>
              <a @click="goHome" class="waves-effect waves-light btn"><i class="material-icons left">arrow_back</i>Volver</a>
            </div>
          </div>

          <div v-show="!loading" class="marg">
            <div v-show="!logged">
              <div class="centrado warning" v-show="error">
                <strong>{{ errMessage }}</strong>
              </div>
              <div class="centrado">
                <form @submit.prevent="signin">
                  <div class="input-field col s12">
                    <input type="text" name="username" id="username" v-model="Username" required>
                    <label for="username">Username</label>
                  </div>

                  <div class="input-field col s12">
                    <input type="password" name="password" v-model="password" required>
                    <label for="password">password</label>
                  </div>

                  <div class="centrado">
                    <button class="waves-effect waves-light btn" type="submit"><i class="material-icons left">send</i>Ingresar</button>
                  </div>
                </form>
              </div>
            </div>

            <div v-show="!logged" class="signup">
              <span><a @click="recPassword" class="anchoa">He olvidado mi contraseña.</a></span>
            </div>

            <div v-show="!logged" class="signup">
              <span>¿No tienes una cuenta? <a @click="signup" class="anchoa">Registrate</a></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../services/auth'
import Loader from './shared/Loader.vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: { Loader },
  data () {
    return {
      loading: false,
      Username: '',
      password: '',
      error: false,
      errMessage: ''
    }
  },

  methods: {
    ...mapActions(['_getUser', '_logging']),

    async signin () {
      this.error = false
      const user = {
        username: this.Username,
        password: this.password
      }

      this.loading = true
      const log = await this._logging(user)
      this.loading = false

      if (log.error) {
        this.error = true
        this.errMessage = log.error
        return
      }

      this.$router.push({ name: 'task' })
    },

    signup () {
      this.$router.push({ name: 'signup' })
    },

    goHome () {
      this.$router.push({ name: 'task' })
    },

    salir () {
      this.$store.commit('clearInfo')
      // this.$bus.$emit('new-user', auth.isLoggedIn())
    },

    recPassword () {
      this.$router.push({ name: 'password' })
    }
  },

  computed: {
    ...mapState(['logged', 'username']),
    ...mapGetters(['userIsLogged'])
  },

  mounted () {
    const token = auth.getToken()

    if (!token) {
      this.$store.commit('logUser', false)
    }
  }
}
</script>

<style scoped>
.centrado {
  text-align: center;
  margin-bottom: 60px;
}

.centrado button {
  margin-top: 60px;
}

.marg .centrado a {
  margin-top: 60px;
}

.centrado strong {
  margin-bottom: 60px;
}

.spani {
  margin-top: 60px;
}

.app {
  margin-bottom: 60px;
}

.marg {
  margin-top: 60px;
}

.app h3 {
  margin-bottom: 0;
}

.warning {
  padding: 10px;
  background-color: red;
  color: white;
  margin-bottom: 60px;
  margin-top: 0px;
  border-radius: 5px;
}

.anchoa {
  text-decoration: none;
  cursor: pointer;
}

.signup {
  text-align: center;
  margin-bottom: 60px;
}
</style>
