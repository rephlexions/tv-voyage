<script setup lang="ts">
import { useShows } from '@/store/shows'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import type { Genre } from '@/types/Genre'
import Hero from '@/components/Hero.vue'
import MoviesCarousel from '@/components/MoviesCarousel.vue'

const showsStore = useShows()
const { genres, latestShows, firstCarousel, secondCarousel, thirdCarousel, isSet } =
  storeToRefs(showsStore)

onMounted(() => {
  if (!isSet.value) {
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
      showsStore.setLatestShows(8)
      showsStore.clearStore()
    })
  }
})
</script>

})

<template>
  <main class="bg-primary text-primary-foreground">
    <Hero :shows="latestShows" />
    <div class="shows-list">
      <div class="shows-list__item">
        <h2>Top TV Shows</h2>
        <MoviesCarousel :shows="latestShows"></MoviesCarousel>
      </div>
      <div class="shows-list__item">
        <h2>Science-Fiction</h2>
        <MoviesCarousel :shows="firstCarousel"></MoviesCarousel>
      </div>
      <div class="shows-list__item">
        <h2>Action</h2>
        <MoviesCarousel :shows="secondCarousel"></MoviesCarousel>
      </div>
      <div class="shows-list__item">
        <h2>Romance</h2>
        <MoviesCarousel :shows="thirdCarousel"></MoviesCarousel>
      </div>
    </div>
  </main>
</template>
<style scoped>
.shows-list {
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 50px;
  margin-left: 100px;
  margin-right: 100px;
  padding-bottom: 100px;
}
.shows-list__item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 32px;
  text-align: left;
}
</style>
