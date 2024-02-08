<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { showsAPIService } from './data/shows.api'
import { ref, onMounted } from 'vue'

const shows = ref<any>([])

onMounted(() => {
  showsAPIService
    .getShows()
    .then((data) => {
      shows.value = data
      console.log(data)
    })
    .catch((error) => {
      console.error(error)
    })
})
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
