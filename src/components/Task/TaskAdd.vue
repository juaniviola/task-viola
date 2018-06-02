<template>
  <div class="container">
    <div class="row">
      <div v-show="loading">
        <loader></loader>
      </div>

      <div v-show="!loading">
        <div class="palito">
          <span>Agregar tarea</span>
        </div>
        <form @submit.prevent="addTask">
          <div class="input-field col s12">
            <input type="text" name="name" v-model="name" id="name" required>
            <label for="name">Name</label>
          </div>

          <div class="input-field col s12">
            <input type="text" name="description" v-model="description" required>
            <label for="description">Description</label>
          </div>

          <div class="buttoni">
            <button type="submit" style="margin-top: 17px;" class="waves-effect waves-green btn-flat">Agregar</button>
            <a @click="volver" style="margin-top: 17px;" class="waves-effect waves-green btn-flat">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import Loader from '../shared/Loader.vue'
  import { mapActions } from 'vuex'

  export default {
    components: { Loader },

    data () {
      return {
        name: '',
        description: '',
        loading: false
      }
    },

    methods: {
      ...mapActions(['addTasks']),

      volver () {
        this.$router.push({ name: 'task' })
      },

      async addTask () {
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user'))

        if (!token || !user || !user.username) {
          console.log('here')
          this.$store.commit('clearInfo')
          return this.$router.push({ name: 'signin' })
        }

        const task = {
          name: this.name,
          description: this.description,
          username: user.username
        }

        this.loading = true
        const p = await this.addTasks({ task, token })
        this.loading = false

        if (this.handleError(p)) {
          this.$router.push({ name: 'taskdetail', params: { uuid: p.task.uuid } })
        }
      },

      handleError (err) {
        if (err.message) {
          if (err.message.includes('TokenExpiredError') || err.message.includes('JsonWebTokenError') || err.message.includes('jwt malformed')) {
            this.$store.commit('clearInfo')
            this.$toast.bottom('Algo ocurrió con tu sesión')
            return this.$router.push({ name: 'signin' })
          }
        }

        if (err.error) {
          return this.$toast.bottom('Algo falló...')
        }

        return true
      }
    },

    mounted () {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$store.commit('clearInfo')
        return this.$router.push({ name: 'signin' })
      }

      document.getElementById('name').focus()
    }
  }
</script>

<style scoped>
  form {
    margin-top: 17px;
  }

  .buttoni {
    text-align: center;
  }

  .palito {
    margin-top: 30px;
    padding-left: 10px;
    border-left: 7px solid black;
    background-color: #e6e6e6;
    border-radius: 5px;
  }

  .palito span {
    color: #616161;
    font-size: 17px;
  }
</style>
