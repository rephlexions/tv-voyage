<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Show } from '@/types/types'
import { normalizeSearchResults } from '@/utils/utils'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const searchQuery = ref<string>('')

const results = ref<Show[] | null>(null)

// async function searchShows() {
//   const query = route.params.query as string
//   searchQuery.value = query
//   const searchResults = await tvMaze.searchShows(query)
//   const normalizedShows: Show[] = normalizeSearchResults(searchResults)
//   results.value = normalizedShows
// }

onMounted(() => {
  // searchShows()
})

// watch(
//   () => route.params.query,
//   () => searchShows()
// )

const openDetailPage = (id: number) => {
  router.push({ path: `/show/${id}` })
}
</script>
<template>
  <main class="bg-primary">
    <div class="search-results">
      <h5>Search results for "{{ searchQuery }}"</h5>
      <div v-if="results" class="search-results__cards">
        <Card
          v-for="(show, index) in results"
          :key="index"
          class="dark search-results__card"
          @click="openDetailPage(show.id)"
        >
          <CardContent class="search-results__card-content">
            <img v-if="show.image" :src="show.image.original" alt="Show cover" />
          </CardContent>
          <CardFooter class="search-results__card-footer">
            <h4>{{ show.name }}</h4>
          </CardFooter>
        </Card>
      </div>
    </div>
  </main>
</template>
<style scoped>
.back-button {
  margin-top: 32px;
  margin-bottom: 32px;
}
.search-results {
  padding: 40px;
  height: auto;
}

.search-results__cards {
  padding-top: 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.search-results__card {
  width: 100%;
  max-width: 250px;
  height: 380px;
  margin-bottom: 3rem;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  transition-property: transform;
  transition-duration: 0.5s;
  transition-delay: 0s;
}

.search-results__card:hover {
  cursor: pointer;
  transform: scale(1.05);
}

.search-results__card-content {
  padding: 0;
  margin: 0;
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
}
.search-results__card-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 2/3;
}

.search-results__card-footer {
  background-color: #020817;
  padding: 8px 0px;
  display: flex;
  align-content: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
h4 {
  color: #fff;
  margin-left: auto;
  margin-right: auto;
  font-weight: 800;
}

@media screen and (max-width: 600px) {
  .search-results__cards {
    justify-content: center;
  }
}
</style>
