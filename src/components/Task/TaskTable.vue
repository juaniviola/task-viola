<template>
  <div>
    <div class="taskinia">
      <div class="centrado-but">
        <button @click="addTask" class="waves-effect waves-light btn-floating pulse add-task"><i class="material-icons">add</i></button>
      </div>
      <ul class="collection" v-for="(task, index) in tasks" :key="index">
        <li class="collection-item avatar botonaso">
          <span @click="goTask(task.uuid)" class="title username truncate">{{ task.name }}</span>
          <p class="jopingos truncate">{{ task.description }}</p> <br>
          <div class="truncate">
            <span class="joder">{{ task.username }}</span> <span class="createdAt"> - {{ task.createdAt | moment("from") }}</span>
          </div>
          <a @click="editTask(task.uuid)" class="secondary-content pointer"><i class="material-icons">more_vert</i></a>
        </li>
      </ul>
    </div>

    <div v-show="cantTask">
      <div class="container">
        <div class="row">
          <div class="col s12 center">
            <span>No hay tareas. Agrega una...</span> <br>
            <button @click="addTask" class="waves-effect waves-light btn-floating btn-small buti"><i class="material-icons">add</i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from '../../services/auth'

  export default {
    name: 'TaskTable',

    data () {
      return {
        name: '',
        description: '',
        uuid: '',
        cantTask: false
      }
    },

    props: ['tasks'],

    methods: {
      addTask () {
        const token = auth.getToken()
        const user = JSON.parse(localStorage.getItem('user'))

        if (!token || !user || !user.username) {
          this.$store.commit('clearInfo')
          return this.$router.push({ name: 'signin' })
        }

        this.$router.push({ name: 'add' })
      },

      editTask (uuid) {
        return this.$router.push({ name: 'taskdetail', params: { uuid } })
      },

      closeModal () {
        $('.modal').modal('close')
      }
    }
  }
</script>

<style scoped>
.botonaso {
  width: 100%;
}

.editar {
  margin-right: 35px;
}

.japinga {
  padding-left: 15px;
}

.centrado-but {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
  text-align: center;
}

.pointer {
  cursor: pointer;
}

.username {
  font-weight: bold;
}

.centerado {
  margin-left: 7px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.centrado-but {
  margin-bottom: 60px;
  text-align: center;
}

.joder {
  color: #219287;
}

li.collection-item.avatar.botonaso {
  padding-left: 15px;
}

p.jopingos {
  max-width: 90%;
}

span.title.username {
  max-width: 80%;
}

h4.center {
  margin-top: 15px;
}

.buti {
  margin-top: 60px;
}

.mamita {
  text-align: center;
  margin-top: 60px;
  margin-bottom: 60px;
}

.taskinia {
  margin-bottom: 60px;
}

.add-task {
  position: fixed;
  bottom: 30px;
  right: 30px;
}

.createdAt {
  color: #636563;
}

ul.collection {
  border-radius: 5px;
}
</style>
