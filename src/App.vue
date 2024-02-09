<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { showsAPIService } from './data/showsApi'
import { ref, onMounted } from 'vue'
import { useShows } from './store/shows'
import { storeToRefs } from 'pinia'

// const shows = ref<any>([])
const showsStore = useShows()
const { shows, isRequestLoading } = storeToRefs(showsStore)

onMounted(() => {
  // showsAPIService
  //   .getShows()
  //   .then((data) => {
  //     shows.value = data
  //     console.log(data)
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })
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
./data/showsApi
