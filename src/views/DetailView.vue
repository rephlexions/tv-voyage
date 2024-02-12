<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showsAPIService } from '@/services/showsApi'
import type { Show } from '@/types/Show'
import type { Episode } from '@/types/Episode'
import { normalizeShows, normalizeEpisodes, groupEpisodesBySeason } from '@/utils/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()

const showID = route.params.id as string
const showCover = ref<string>('')
const episodesList = ref<Record<string, Episode[]>>({})
let show = ref<Show | null>(null)

async function getShow() {
  const [showInfo, images, episodes] = await Promise.all([
    showsAPIService.getShowById(showID),
    showsAPIService.getShowImages(showID),
    showsAPIService.getShowEpisodes(showID)
  ])

  const normalizedShows: Show[] = normalizeShows(showInfo)
  show.value = normalizedShows[0]

  const backgroundObject = images[0].find((obj: { type: string }) => obj.type === 'background')
  showCover.value = backgroundObject ? backgroundObject.resolutions.original.url : ''

  const normalizedEpisodes: Episode[] = normalizeEpisodes(episodes[0])
  episodesList.value = groupEpisodesBySeason(normalizedEpisodes)
}
const goHome = () => {
  router.push({ path: '/' })
}

onMounted(() => {
  getShow()
})
</script>

})

<template>
  <main class="bg-primary">
    <Button @click="goHome" class="back-button dark">
      <ChevronLeft class="w-4 h-4" />
    </Button>
    <div class="show-header">
      <div class="show-header__summary">
        <h1>{{ show?.name }}</h1>
        <p v-html="show?.summary"></p>
      </div>
      <img class="show-header__cover" :src="showCover" alt="Show cover" />
    </div>
    <Tabs default-value="show-info" class="show-info dark">
      <TabsList>
        <TabsTrigger value="show-info">Show Info</TabsTrigger>
        <TabsTrigger value="episodes">Episodes</TabsTrigger>
      </TabsList>
      <TabsContent value="show-info">
        <h2>Show info</h2>
        <div class="show-info__list">
          <div class="show-info__list-item">
            <h5>Rating:</h5>
            <div class="show-info__rating">
              <p v-if="show && show.rating">{{ show?.rating.average }}</p>
              <img src="../assets/star.svg" alt="Show rating" />
            </div>
          </div>
          <div class="show-info__list-item">
            <h5>Genres:</h5>
            <p v-if="show && show.genres">{{ show?.genres.join(', ') }}</p>
          </div>
          <div class="show-info__list-item">
            <h5>Status:</h5>
            <p>{{ show?.status }}</p>
          </div>
          <div class="show-info__list-item">
            <h5>Language:</h5>
            <p>{{ show?.language }}</p>
          </div>
          <div class="show-info__list-item">
            <h5>Premiered:</h5>
            <p>{{ show?.premiered }}</p>
          </div>
          <div class="show-info__list-item">
            <h5>Official Site:</h5>
            <a v-if="show?.officialSite" :href="show?.officialSite">{{ show?.officialSite }}</a>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="episodes">
        <h2>Episodes</h2>
        <template v-for="(season, index) in Object.keys(episodesList)" :key="index">
          <h3>Season {{ season }}</h3>
          <ul>
            <li v-for="episode in episodesList[season]" :key="episode.id">
              <p>{{ episode.name }}</p>
            </li>
          </ul>
        </template>
      </TabsContent>
    </Tabs>
  </main>
</template>
<style scoped>
.show-header {
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 32px;
  height: 600px;
  margin-left: 50px;
  margin-right: 40px;
}
.show-header__summary {
  flex: 1 0 30%;
  max-width: 600px;
  margin-top: 180px;
}
.show-header__cover {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  /* mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.65) 50%);
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.65) 50%); */
}

.show-info {
  margin-top: 80px;
  padding-bottom: 100px;
}

.show-info__list {
  margin-top: 16px;
  display: flex;
  width: 380px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.show-info__list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.show-info__rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-button {
  position: relative;
  top: 20px;
  left: 50px;
  z-index: 100;
}

a {
  color: #fff;
  text-decoration: underline;
}

@media screen and (max-width: 1500px) {
  .show-header {
    flex-direction: column;
    gap: 16px;
    height: auto;
  }
  .show-header__summary {
    margin-top: 0;
  }
  .show-header__cover {
    max-width: 100%;
    height: auto;
    mask-image: none;
    -webkit-mask-image: none;
  }
  .show-info {
    margin-top: 32px;
  }
  .back-button {
    margin-bottom: 40px;
  }
}
</style>
@/utils/utils
