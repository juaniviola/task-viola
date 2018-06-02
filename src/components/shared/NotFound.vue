<template>
  <div class="madre">
    <div class="notf">
      <strong>404 | la url no existe 😢</strong><br>
      <a @click="go" class="waves-effect waves-light btn risa"><i class="material-icons left">arrow_back</i>Volver</a>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      go () {
        return this.$router.push({ name: 'task' })
      }
    }
  }
</script>

<style scoped>
.notf {
  text-align: center;
  margin-top: 60px;
  margin-bottom: 60px;
}

.notf .risa {
  margin-top: 60px;
}

strong {
  font-weight: bold;
}
</style>

