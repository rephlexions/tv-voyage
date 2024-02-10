<script setup lang="ts">
import { useShows } from '@/store/shows'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import type { Genre } from '@/types/Genre'

const showsStore = useShows()
const { genres, firstCarousel, secondCarousel, isRequestLoading } = storeToRefs(showsStore)

onMounted(() => {
  showsStore.fetchShows().then(() => {
    const types = ['Science-Fiction', 'Action', 'Romance']
    types.forEach((type, index) => {
      const genreIndex = genres.value.findIndex((genre: Genre) => genre.name === type)
      if (genreIndex) {
        console.log(type, index)

        const genre: Genre = genres.value[genreIndex]
        showsStore.setShowsByGenre(genre, index)
      }
    })
  })
})
</script>

})

<template>
  <main>
    <h2
      class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 justify-center text-center"
    >
      Science-Fiction
    </h2>
    <div class="shows">
      <div class="shows__card" v-for="show in firstCarousel" :key="show.id">
        <img :src="show.image.medium" alt="Show cover" srcset="" />
        <h2>{{ show.name }}</h2>
      </div>
    </div>
    <h2
      class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 justify-center text-center"
    >
      Action
    </h2>
    <div class="shows">
      <div class="shows__card" v-for="show in secondCarousel" :key="show.id">
        <img :src="show.image.medium" alt="Show cover" srcset="" />
        <h2>{{ show.name }}</h2>
      </div>
    </div>
  </main>
</template>
<style scoped>
.shows__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.shows {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
