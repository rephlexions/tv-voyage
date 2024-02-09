<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useShows } from './store/shows'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'

// const shows = ref<any>([])
const showsStore = useShows()
const { shows, isRequestLoading } = storeToRefs(showsStore)

onMounted(() => {
  showsStore.fetchShows()
  console.log(shows.value)
})
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <Button>Click me</Button>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
