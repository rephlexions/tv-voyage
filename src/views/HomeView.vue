<script setup lang="ts">
import { useShows } from '@/store/shows'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import Hero from '@/components/Hero.vue'
import MoviesCarousel from '@/components/MoviesCarousel.vue'

const showsStore = useShows()
const { latestShows, isSet, sfShows, actionShows, romanceShows } = storeToRefs(showsStore)

onMounted(() => {
  if (!isSet.value) {
    showsStore.fetchShows().then(() => {
      showsStore.setLatestShows(8)
      // showsStore.$reset();
    })
  }
})
</script>

<template>
  <main class="bg-primary text-primary-foreground">
    <Hero :shows="latestShows" />
    <div class="shows-list">
      <div class="shows-list__item">
        <h2>Top TV Shows</h2>
        <MoviesCarousel :shows="latestShows"></MoviesCarousel>
      </div>
      <div v-if="sfShows" class="shows-list__item">
        <h2>Science-Fiction</h2>
        <MoviesCarousel :shows="sfShows"></MoviesCarousel>
      </div>
      <div class="shows-list__item">
        <h2>Action</h2>
        <MoviesCarousel :shows="actionShows"></MoviesCarousel>
      </div>
      <div class="shows-list__item">
        <h2>Romance</h2>
        <MoviesCarousel :shows="romanceShows"></MoviesCarousel>
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
