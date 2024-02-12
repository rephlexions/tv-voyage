<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { showsAPIService } from '@/services/showsApi'
import type { Show } from '@/types/Show'
import { normalizeSearchResults } from '@/utils/utils'
import { Card, CardContent } from '@/components/ui/card'

const route = useRoute()

const query = route.params.query as string
const results = ref<Show[] | null>(null)

async function searchShow() {
  const searchResults = await showsAPIService.searchShows(query)

  const normalizedShows: Show[] = normalizeSearchResults(searchResults)
  console.log(normalizedShows)

  results.value = normalizedShows
}

onMounted(() => {
  searchShow()
})
</script>

})

<template>
  <main class="bg-primary">
    <h1>Search results for "{{ query }}"</h1>
    <div v-if="results" class="search-results">
      <Card v-for="(show, index) in results" :key="index" class="search-results__card">
        <CardContent class="search-results__card-content">
          <img v-if="show.image" :src="show.image.original" alt="Show cover" />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
<style scoped></style>
