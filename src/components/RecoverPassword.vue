<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col s12">
          <div v-show="loading" class="centrado">
            <loader></loader>
          </div>

          <div v-show="logged && !loading && !error" class="centrado">
            <span>No debes estar logueado.</span> <br>
            <button class="waves-effect waves-light btn" @click="volver"><i class="material-icons left">arrow_left</i>Volver</button>
          </div>

          <div v-show="!logged && !loading" class="centrado">
            <i class="material-icons">account_circle</i>

            <div v-show="error" class="centrado warning">
              <span>{{ errorMessage }}</span>
            </div>

            <div class="username">
              <span>{{ username }}</span>
            </div>
            <form @submit.prevent="enviar">
              <div class="input-field col s12">
                <input type="password" name="password" v-model="password" required>
                <label for="password">Password</label>
              </div>

              <div class="input-field col s12">
                <input type="password" name="repeatPassword" v-model="repeatPassword" required>
                <label for="repeatPassword">repeat</label>
              </div>

              <div class="centrado">
                <button class="waves-effect waves-light btn" type="submit"><i class="material-icons left">update</i>Actualizar</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../services/service'
import Loader from './shared/Loader.vue'
import auth from '../services/auth'
import { mapState } from 'vuex'

export default {
  components: { Loader },

  data () {
    return {
      username: '',
      password: '',
      repeatPassword: '',
      _id: '',
      loading: false,
      error: false,
      errorMessage: ''
    }
  },

  methods: {
    async enviar () {
      if (this.password === this.repeatPassword) {
        this.error = false
        this.loading = true

        const save = await service.updatePassword(this.username, this.password, this._id)
        this.loading = false

        if (save.error) {
          this.error = true
          this.errorMessage = save.error.message
        } else {
          this.error = false
          this.$router.push({ name: 'signin' })
        }
      } else {
        this.error = true
        this.errorMessage = 'Las contraseñas no coinciden'
      }
    },

    volver () {
      this.$router.push({ name: 'task' })
    }
  },

  async created () {
    const username = this.$route.params.username
    const id = this.$route.params._id

    this._id = id
    this.username = username
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

.username {
  margin-top: 60px;
  margin-bottom: 60px;
  font-size: 17px;
}
</style>
