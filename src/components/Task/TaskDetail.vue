<template>
  <div class="container">
    <div class="row">
      <div v-show="loading">
        <loader></loader>
      </div>

      <div style="margin-top: 35px;" v-show="!loading">
        <div v-show="task.uuid">
          <div v-show="!edit">
            <h4 class="textiano">{{ task.name }}</h4>
            <span class="textiano textil">{{ task.username }} - {{ task.createdAt | moment("from") }}</span>
            <p class="textiano">{{ task.description }}</p>
            <div class="divider"></div>
          </div>

          <div v-show="edit">
            <div class="palito">
              <span>Editar tarea</span>
            </div>
            <form @submit.prevent="editarTask">
              <div class="input-field col s12">
                <input type="text" placeholder="name" id="name" v-model="name" required>
              </div>

              <div class="input-field col s12">
                <input type="text" placeholder="description" v-model="desc" required>
              </div>

              <div class="buttoni" style="text-align:center;">
                <button type="submit" style="margin-top: 17px;" class="waves-effect waves-green btn-flat">Editar</button>
                <a @click="editTask" style="margin-top: 17px;" class="waves-effect waves-green btn-flat">Cancelar</a>
              </div>
            </form>
          </div>

          <div v-show="logged && log" class="fixed-action-btn">
            <a class="btn-floating btn-large">
              <i class="large material-icons">mode_edit</i>
            </a>
            <ul>
              <li><a @click="editTask" class="btn-floating gil"><i class="material-icons">edit</i></a></li>
              <li><a href="#deleteTask" class="btn-floating gil modal-trigger"><i class="material-icons">delete</i></a></li>
              <li><a @click="goHome" class="btn-floating gil"><i class="material-icons">arrow_back</i></a></li>
            </ul>
          </div>
        </div>

        <div id="deleteTask" class="modal borde">
          <div class="del-span">
            <span>¿Estás seguro de esto?</span>
          </div>
          <div class="divider"></div>
          <div class="del-button">
            <button @click="deleteTask" class="waves-effect waves-light btn btn-flat">Eliminar</button>
            <a @click="cancelTask" class="waves-effect waves-light btn btn-flat">Cancelar</a>
          </div>
        </div>

        <div v-show="!task.uuid">
          <h5>No se encuentra la tarea 😢</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Task from '../../services/task'
  import Loader from '../shared/Loader.vue'
  import { mapState, mapActions, mapGetters } from 'vuex'
import { setTimeout } from 'timers';

  export default {
    name: 'taskdetail',

    components: { Loader },

    data () {
      return {
        task: {},
        loading: false,
        log: false,
        edit: false,
        name: '',
        desc: ''
      }
    },

    methods: {
      ...mapActions(['deleteTasks', '_updateTask', 'getTasksByUsername']),

      async getTask (uuid) {
        const user = JSON.parse(localStorage.getItem('user'))

        if (!this.getTasks) {
          const token = localStorage.getItem('token')

          if (!token || !user || !user.username) {
            this.$store.commit('clearInfo')
            return this.$router.push({ name: 'signin' })
          }

          this.loading = true
          const settask = await this.getTasksByUsername({ username: user.username, token})
          this.loading = false

          if (this.handleError(settask)) {
            const t = settask.find(({ uuid }) => uuid ===  this.$route.params.uuid)
            if (t) {
              this.task = t
              this.name = t.name
              this.desc = t.description
              if (user.username === t.username) { this.log = true }
            }
          }
        } else {
          const t = this.getTasks.find(({uuid}) => uuid === this.$route.params.uuid)
          if (t && user) {
            this.task = t
            this.name = t.name
            this.desc = t.description
            if (t.username === user.username) { this.log = true }
          }
        }
      },

      goHome () {
        return this.$router.push({ name: 'task' })
      },

      async deleteTask () {
        const token = localStorage.getItem('token')

        if (!token) {
          this.$store.commit('clearInfo')
          return this.$router.push({ name: 'signin' })
        }

        this.loading = true
        const del = await this.deleteTasks({ uuid: this.task.uuid, token })
        this.loading = false

        if (this.handleError(del)) {
          this.$toast.bottom('operación exitosa')
          return this.$router.push({ name: 'task' })
        }
      },

      cancelTask () {
        $('.modal').modal('close')
      },

      async editarTask () {
        const token = localStorage.getItem('token')

        if (!token) {
          this.$store.commit('clearInfo')
          return this.$router.push({ name: 'signin' })
        }

        this.loading = true
        const send = await this._updateTask({ tarea: {
          name: this.name,
          description: this.desc,
          uuid: this.task.uuid,
          username: this.task.username
        }, token })
        this.loading = false

        if (this.handleError(send)) {
          this.editTask()
        }
      },

      editTask () {
        this.edit = !this.edit

        if (this.edit) {
          setTimeout(() => {
            $('.fixed-action-btn').floatingActionButton('close')
            document.getElementById('name').focus()
          }, 0)
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
      ...mapState(['logged', 'tasks']),
      ...mapGetters(['getUsername', 'getTasks'])
    },

    mounted () {
      if (!this.getUsername) {
        const user = localStorage.getItem('user')
        if (!user || !user.username) { this.log = false }
      } else {
        if (this.getUsername === this.task.username) {
          this.log = true
        }
      }

      $('.fixed-action-btn').floatingActionButton()
      $('.modal').modal()
    },

    created () {
      const { uuid } = this.$route.params

      const find = this.tasks.find((task) => uuid === task.uuid)
      if (!find) {
        return this.getTask(uuid)
      }

      this.task = find
      this.name = find.name
      this.desc = find.description
    }
  }
</script>

<style scoped>
  .textiano {
    overflow-wrap: break-word;
  }

  .textil {
    color: #887c7c;
  }

  div.divider {
    height: 2.65px;
  }

  a.btn-floating.gil {
    background-color: #4db883;
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

  .borde {
    border-radius: 10px;
  }

  .del-span {
    text-align: center;
    margin: 20px;
  }

  .del-button {
    text-align: center;
    margin: 10px;
  }
</style>
