<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { showsAPIService } from '@/services/showsApi'
import type { Show } from '@/types/Show'
import { normalizeSearchResults } from '@/utils/utils'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()

const query = route.params.query as string
const results = ref<Show[] | null>(null)

async function searchShows() {
  const searchResults = await showsAPIService.searchShows(query)
  const normalizedShows: Show[] = normalizeSearchResults(searchResults)
  results.value = normalizedShows
}

onMounted(() => {
  searchShows()
})

const openDetailPage = (id: number) => {
  router.push({ path: `/show/${id}` })
}
const goBack = () => {
  router.back()
}
</script>
<template>
  <main class="bg-primary">
    <div class="search-results">
      <Button @click="goBack" class="back-button dark">
        <ChevronLeft class="w-4 h-4" />
      </Button>
      <h5>Search results for "{{ query }}"</h5>
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
            <p>{{ show.name }}</p>
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
  margin: 0px 40px 0 40px;
  padding-bottom: 50px;
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
  height: 350px;
  margin-bottom: 3rem;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.search-results__card:hover {
  cursor: pointer;
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
p {
  color: #fff;
  margin-left: auto;
  margin-right: auto;
}

@media screen and (max-width: 600px) {
  .search-results__cards {
    justify-content: center;
  }
}
</style>
