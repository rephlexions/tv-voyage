<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { tmdb } from '@/api/tmdb'
import type { MovieCollection, Movie } from '@/types/types'
import { useToast } from '@/components/ui/toast/use-toast'
import HeroCarousel from '@/components/HeroCarousel.vue'

const { toast } = useToast()

const popularMovies: Ref<Movie[]> = ref([])
onMounted(() => {
  tmdb
    .popular()
    .then((result) => {
      popularMovies.value = (result as MovieCollection).results.slice(0, 5)
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
  <HeroCarousel :shows="popularMovies"></HeroCarousel>
  <main class="bg-primary text-primary-foreground"></main>
</template>
<style scoped></style>
