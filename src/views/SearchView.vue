<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { showsAPIService } from '@/services/showsApi'
import type { Show } from '@/types/Show'
import { normalizeSearchResults } from '@/utils/utils'

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
  <main class="bg-primary">search</main>
</template>
<style scoped></style>
