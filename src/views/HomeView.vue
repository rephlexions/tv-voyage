<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { tmdb } from '@/api/tmdb'
import type { MovieCollection, Movie } from '@/types/types'
import { useToast } from '@/components/ui/toast/use-toast'
import HeroCarousel from '@/components/HeroCarousel.vue'

const { toast } = useToast()

const nowPlaying: Ref<Movie[]> = ref([])
const topRated: Ref<Movie[]> = ref([])
onMounted(async () => {
  Promise.all([tmdb.nowPlaying(), tmdb.topRated()])
    .then((results) => {
      nowPlaying.value = (results[0] as MovieCollection).results.slice(0, 5)
      topRated.value = (results[1] as MovieCollection).results.slice(0, 5)
    })
    .catch((error) => {
      toast({
        title: 'An error occurred',
        description: `${error}`,
        variant: 'destructive'
      })
    })
})
</script>

<template>
  <h1 class="scroll-m-20 p-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
    Now playing in theaters
  </h1>
  <HeroCarousel :shows="nowPlaying"></HeroCarousel>
  <main class="bg-primary text-primary-foreground"></main>
</template>
<style scoped></style>
