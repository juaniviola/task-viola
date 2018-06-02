<template>
  <div class="centrado">
    <div v-show="loading">
      <loader></loader>
    </div>

    <div v-show="notFound && !loading" class="global">
      <span class="centrado">El usuario no existe</span>
    </div>

    <div v-show="!notFound && !loading">
      <div class="container">
        <div class="row">

          <div style="margin-top: 60px;" class="warning" v-show="error">
            <span> {{ errorMessage }} </span>
          </div>

          <div class="global">
            <span class="centrado global username">{{ oldUs }}</span>
          </div>
          <form @submit.prevent="updateInfo">
            <div class="input-field col s6">
              <input type="text" name="firstName" v-model="FirstName" required>
              <label class="active" for="firstName">Nombre</label>
            </div>

            <div class="input-field col s6">
              <input type="text" name="lastName" v-model="LastName" required>
              <label class="active" for="lastName">Apellido</label>
            </div>

            <div class="input-field col s6">
              <input type="text" name="username" v-model="Username" required>
              <label class="active" for="username">Username</label>
            </div>

            <div class="input-field col s6">
              <input type="text" name="email" v-model="Email" required>
              <label class="active" for="email">Email</label>
            </div>

            <div class="input-field col s12">
              <input type="password" name="password" v-model="passwordConfirm" required>
              <label for="password">confirmar contraseña</label>
            </div>

            <div class="centrado global">
              <button class="waves-effect waves-light btn" type="submit"><i class="material-icons left">edit</i>Editar</button>
            </div>
          </form>

          <div style="margin-bottom: 60px;">
            <a href="#delAcc" @click="eliminarCuenta" class="pass modal-trigger">Eliminar cuenta</a>
          </div>

          <div style="margin-bottom: 60px;">
            <a class="pass" @click="changePassword">Cambiar contraseña</a>
          </div>

          <div class="changePass" v-show="changePass">
            <form @submit.prevent="updatePassword">
              <div class="input-field col s12">
                <input class="inp" type="password" name="oldPassword" id="password" v-model="oldPassword" required>
                <label for="oldPassword">Current password</label>
              </div>

              <div class="input-field col s12">
                <input type="password" name="newPassword" v-model="newPassword" required>
                <label for="newPassword">New password</label>
              </div>

              <div class="input-field col s12">
                <input type="password" name="newPassword2" v-model="newPassword2" required>
                <label for="newPassword2">Repeat new password</label>
              </div>

              <div class="centrado global">
                <button class="waves-effect waves-light btn btn-flat" type="submit">Cambiar</button>
              </div>
            </form>
          </div>

          <div id="delAcc" class="modal centrado borde">
            <div style="margin-top: 20px; margin-bottom: -30px;">
              <span>Eliminar cuenta</span>
            </div>

            <div class="container">
              <form @submit.prevent="deleteAccount">
                <div class="input-field col s12">
                  <input type="password" name="password" id="passdel" v-model="password" required>
                  <label for="password">Password</label>
                </div>

                <div class="centrado global">
                  <button style="margin-top: 30px;" class="waves-effect waves-light btn btn-flat" type="submit">Eliminar</button>
                  <a style="margin-top: 30px;" class="waves-effect waves-light btn btn-flat" @click="cancel">Cancelar</a>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import Loader from './shared/Loader.vue'
  import service from '../services/service'
  import auth from '../services/auth'
  import { mapActions, mapState, mapGetters } from 'vuex'
import { setTimeout } from 'timers';

  export default {
    components: { Loader },

    data () {
      return {
        Username: '',
        FirstName: '',
        LastName: '',
        Email: '',
        password: '',
        passwordConfirm: '',

        oldUs: '',
        oldEm: '',

        oldPassword: '',
        newPassword: '',
        newPassword2: '',

        loading: false,
        error: false,
        errorMessage: false,
        notFound: false,
        changePass: false
      }
    },

    methods: {
      ...mapActions(['_deleteUser', '_updateUser']),

      goToHome () {
        this.$router.push({ name: 'task' })
      },

      changePassword () {
        this.changePass = !this.changePass
        this.oldPassword = ''
        this.newPassword = ''
        this.newPassword2 = ''

        if (this.changePass) {
          setTimeout(() => {
            const p = document.getElementById('password')
            p.focus()
            p.scrollIntoView()
          }, 0)
        }
      },

      async updateInfo () {
        this.error = false

        const token = auth.getToken()

        if (!token) {
          this.$store.commit('clearInfo')
          return this.$router.push({ name: 'signin' })
        }

        const user = {
          username: this.Username,
          firstName: this.FirstName,
          lastName: this.LastName,
          email: this.Email
        }

        if (this.username !== this.Username) {
          const vuser = await service.getUserByUsername(this.Username)

          if (vuser) {
            this.error = true
            this.errorMessage = 'El username ya está en uso'
            return
          }

          this.loading = true
          const send = await this._updateUser({ user, password: this.passwordConfirm, token })
          this.loading = false

          if (send.message === 'TokenExpiredError' || send.message === 'No autorizado' || send.message === 'Unhauthorized') {
            this.$store.commit('clearInfo')
            this.$router.push({ name: 'signin' })
            return this.$toast.bottom('Algo ocurrió con tu sesión...')
          }

          if (send.error) {
            this.error = true
            this.errorMessage = send.error.message
            return
          }

          this.passwordConfirm = ''
          return this.$toast.bottom('Operación exitosa')
        } else if (this.email !== this.Email) {
          const vemail = await service.getUserByEmail(this.Email)

          if (vemail) {
            this.error = true
            this.errorMessage = 'El email ya está en uso'
            return
          }

          this.loading = true
          const send = await this._updateUser({ user, password: this.passwordConfirm, token })
          this.loading = false

          if (send.message === 'TokenExpiredError' || send.message === 'No autorizado' || send.message === 'Unhauthorized') {
            this.$store.commit('clearInfo')
            this.$router.push({ name: 'signin' })
            return this.$toast.bottom('Algo ocurrió con tu sesión...')
          }

          if (send.error) {
            this.error = true
            this.errorMessage = send.error.message
            return
          }

          this.passwordConfirm = ''
          return this.$toast.bottom('Operación exitosa')
        } else if (this.username === this.Username && this.email === this.Email) {
          this.loading = true
          const send = await this._updateUser({ user, password: this.passwordConfirm, token })
          this.loading = false

          if (send.message === 'TokenExpiredError' || send.message === 'No autorizado' || send.message === 'Unhauthorized') {
            this.$store.commit('clearInfo')
            this.$router.push({ name: 'signin' })
            return this.$toast.bottom('Algo ocurrió con tu sesión...')
          }

          if (send.error) {
            this.error = true
            this.errorMessage = send.error.message
            return
          }

          this.passwordConfirm = ''
          this.$toast.bottom('Operación exitosa')
        }
      },

      async updatePassword () {
        this.error = false
        const token = auth.getToken()

        if (!token || !this.logged) {
          this.$store.commit('clearInfo')
          this.$router.push({ name: 'signin' })
          return
        }

        if (this.newPassword !== this.newPassword2) {
          this.error = true
          this.errorMessage = 'Las contraseñas no coinciden'
          return
        }

        this.loading = true
        const up = await service.passwordUpdate(this.oldPassword, this.newPassword, token)
        this.loading = false

        if (up.message === 'TokenExpiredError' || up.message === 'No autorizado' || up.message === 'Unhauthorized') {
          this.$store.commit('clearInfo')
          this.$router.push({ name: 'signin' })
          return this.$toast.bottom('Algo ocurrió con tu sesión...')
        }

        if (up.error) {
          this.error = true
          this.errorMessage = up.error.message
          return
        }

        this.changePassword()
        this.$toast.bottom('Operación exitosa')
      },

      async deleteAccount () {
        this.changePassword = false

        const token = auth.getToken()

        if (!this.logged || !token) {
          this.$store.commit('clearInfo')
          return this.$router.push({ name: 'signin' })
        }

        $('.modal').modal('close')
        this.loading = true
        const pa = await this._deleteUser({ username: this.username, password: this.password, token })
        this.loading = false

        if (pa.message === 'TokenExpiredError' || pa.message === 'No autorizado' || pa.message === 'Unhauthorized') {
          this.$store.commit('clearInfo')
          this.$router.push({ name: 'signin' })
          return this.$toast.bottom('Algo ocurrió con tu sesión...')
        }

        if (pa.error) {
          this.error = true
          this.errorMessage = pa.error.message
          return
        }

        this.$toast.bottom('Usuario eliminado exitosamente')
        return this.$router.push({ name: 'signin' })
      },

      cancel () {
        $('.modal').modal('close')
        this.password = ''
      },

      eliminarCuenta () {
        setTimeout(() => {
          document.getElementById('passdel').focus()
        }, 0)
      }
    },

    async created () {
      const { username } = this.$route.params

      if (!this.logged) {
        this.$store.commit('clearInfo')
        return this.$router.push({ name: 'signin' })
      }

      if (!this.getUserInfo) {
        const u = JSON.parse(localStorage.getItem('user'))
        const token = localStorage.getItem('token')

        if (!u || !u.username || !token) {
          this.$store.commit('clearInfo')
          this.$router.push({ name: 'signin' })
          return
        }

        if (u.username !== username) {
          this.$router.push({ name: 'notf' })
          return
        }

        this.loading = true
        const us = await service.getUsernameWithToken(username, token)
        this.loading = false

        if (!us) {
          this.$router.push({ name: 'notf' })
          return
        }

        if (!us.error) {
          return this.$toast.bottom('Algo falló...')
        }

        this.Username = us.username
        this.FirstName = us.firstName
        this.LastName = us.lastName
        this.Email = us.email

        this.$store.commit('setUser', {
          username: this.Username,
          firstName: this.FirstName,
          lastName: this.LastName,
          email: this.Email
        })

        return
      }

      this.Username = this.username
      this.FirstName = this.firstName
      this.LastName = this.lastName
      this.Email = this.email
    },

    computed: {
      ...mapState(['logged', 'username', 'firstName', 'lastName', 'email']),
      ...mapGetters(['getUserInfo'])
    },

    mounted () {
      $('.sidenav').sidenav()
      $('.modal').modal()
    }
  }
</script>

<style scoped>
  .centrado {
    text-align: center;
  }

  .pass {
    text-decoration: none;
    font-weight: bold;
    font-size: 17px;
    margin-bottom: 60px;
    cursor: pointer;
  }

  .global {
    margin-bottom: 60px;
    margin-top: 60px;
  }

  button.waves-effect.waves-light.btn {
    margin-top: 60px;
  }

  a.waves-effect.waves-light.btn {
    margin-top: 60px;
  }

  .username {
    font-size: 20px;
    font-weight: bold;
  }

  .warning {
    padding: 10px;
    background-color: red;
    color: white;
    margin-bottom: 60px;
    margin-top: 0px;
    border-radius: 5px;
  }

  .borde {
    border-radius: 10px;
  }
</style>

