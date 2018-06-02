<template>
  <div>
    <div class="container">
      <loader v-show="loading" class="marg"></loader>

      <div v-show="!loading" class="marg">
        <task-table
          :tasks="tasks"
          @new-task="addTask"
          @get-task="getTask"
          @delete-task="deleteTask"
          @update-task="updateTask">
        </task-table>
      </div>
    </div>

  </div>
</template>

<script>
  import TaskTable from './TaskTable.vue'
  import Loader from '../shared/Loader.vue'
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    components: { TaskTable, Loader },

    data () {
      return {
        loading: false
      }
    },

    methods: {
      ...mapActions(['getTasksByUsername']),
      ...mapActions(['deleteTasks']),
      ...mapActions(['addTasks']),
      ...mapActions(['_updateTask']),

      async addTask (obj) {
        const { task, token } = obj

        this.loading = true
        const send = await this.addTasks({ task, token })
        this.loading = false

        this.handleError(send)
      },

      async getTask () {
        const user = JSON.parse(localStorage.getItem('user'))
        const token = localStorage.getItem('token')

        if (!this.logged || !user || !user.username || !token) {
          this.$store.commit('clearInfo')
          return this.$router.push({ name: 'signin' })
        }

        if (!this.getTasks) {
          this.loading = true
          const t = await this.getTasksByUsername({ username: user.username, token })
          this.loading = false

          this.handleError(t)
        }
      },

      async deleteTask (obj) {
        const { uuid, token } = obj

        const del = await this.deleteTasks({ uuid, token })

        if (this.handleError(del)) {
          this.$toast.bottom('Operación exitosa')
        }
      },

      async updateTask (obj) {
        const tarea = obj.task
        const token = obj.token

        const up = await this._updateTask({ tarea, token })

        if (this.handleError(up)) {
          this.$toast.bottom('Operación exitosa')
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

    computed: {
      ...mapState(['tasks', 'logged']),
      ...mapGetters(['getTasks'])
    },

    created () {
      this.getTask()
    },

    mounted () {
      $('.sidenav').sidenav()
      $('.modal').modal()
    }
  }
</script>

<style scoped>
.app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin-bottom: 60px;
}

.botonaso {
  margin-top: 60px;
  margin-bottom: 60px;
}

.marg {
  margin-top: 60px;
}
</style>
