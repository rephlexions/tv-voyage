<script setup lang="ts">
import { useShows } from '@/store/shows'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import type { Genre } from '@/types/Genre'
import Hero from '@/components/Hero.vue'
import Carousel from '@/components/Carousel.vue'

const showsStore = useShows()
const { genres, latestShows, firstCarousel, secondCarousel, isRequestLoading } =
  storeToRefs(showsStore)

onMounted(() => {
  showsStore.fetchShows().then(() => {
    const types = ['Science-Fiction', 'Action', 'Romance']
    types.forEach((type, index) => {
      const genreIndex = genres.value.findIndex((genre: Genre) => genre.name === type)
      if (genreIndex) {
        const genre: Genre = genres.value[genreIndex]
        showsStore.setShowsByGenre(genre, index)
      }
    })
    showsStore.setTopShows(10)
    showsStore.setLatestShows(4)
  })
})
</script>

})

<template>
  <main class="bg-primary text-primary-foreground">
    <Hero :shows="latestShows" />
    <div class="shows-list">
      <div>
        <h2>Science-Fiction</h2>
        <Carousel :shows="firstCarousel"></Carousel>
      </div>
      <div>
        <h2>Action</h2>
      </div>
    </div>
  </main>
</template>
<style scoped>
.shows-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin: 100px;
}
</style>
