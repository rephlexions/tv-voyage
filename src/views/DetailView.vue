<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { tvMaze } from '@/api/tvMaze'
import type { Show, Episode } from '@/types/types'
import { normalizeShows, normalizeEpisodes, groupEpisodesBySeason } from '@/utils/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const route = useRoute()

const showID = route.params.id as string
const showCover = ref<string>('')
const episodesList = ref<Record<string, Episode[]>>({})
let show = ref<Show | null>(null)

const totalSeasons = computed(() => {
  return Object.keys(episodesList.value)
})

async function getShow() {
  const [showInfo, images, episodes] = await Promise.all([
    tvMaze.getShow(showID),
    tvMaze.getShowImages(showID),
    tvMaze.getShowEpisodes(showID)
  ])

  const normalizedShows: Show[] = normalizeShows(showInfo)
  show.value = normalizedShows[0]

  const backgroundObject = images[0].find((obj: { type: string }) => obj.type === 'background')
  showCover.value = backgroundObject ? backgroundObject.resolutions.original.url : ''

  const normalizedEpisodes: Episode[] = normalizeEpisodes(episodes[0])
  episodesList.value = groupEpisodesBySeason(normalizedEpisodes)
}

onMounted(() => {
  getShow()
})
</script>

<template>
  <main class="bg-primary">
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
            <div v-if="show && show.rating" class="show-info__rating">
              <img src="../assets/star.svg" alt="Show rating" />
              <p>{{ show?.rating.average }}</p>
            </div>
          </div>
          <div v-if="show && show.genres" class="show-info__list-item">
            <h5>Genres:</h5>
            <p>{{ show?.genres.join(', ') }}</p>
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
          <div v-if="show?.officialSite" class="show-info__list-item">
            <h5>Official Site:</h5>
            <a :href="show?.officialSite">{{ show?.officialSite }}</a>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="episodes">
        <div class="episodes-cards">
          <Card v-for="(season, index) in totalSeasons" :key="index">
            <CardHeader>
              <CardTitle>Season {{ season }}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Air date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="episode in episodesList[season]" :key="episode.id">
                    <TableCell class="font-medium">
                      {{ episode.number }}
                    </TableCell>
                    <TableCell>{{ episode.name }}</TableCell>
                    <TableCell>
                      <div v-if="episode.rating.average" class="show-info__rating">
                        <img src="../assets/star.svg" alt="Show rating" />
                        {{ episode.rating.average }}
                      </div>
                      <div v-else>-</div>
                    </TableCell>
                    <TableCell>
                      {{ episode.airDate }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
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
  height: fit-content;
  padding: 40px;
}
.show-header__summary {
  flex: 1 0 30%;
}

.show-header__summary p {
  max-height: inherit;
  height: inherit;
  overflow-y: auto;
  border: 1px solid #383838;
  border-radius: 8px;
  padding: 16px;
}
.show-header__cover {
  width: 100%;
  height: 600px;
  object-fit: cover;
  border-radius: 10px;
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
  justify-content: space-between;
  width: 30px;
}

.back-button {
  position: relative;
  top: 35px;
  left: 40px;
  z-index: 100;
}

a {
  color: #fff;
  text-decoration: underline;
}

.episodes-cards {
  color: #fff;
  margin-top: 40px;
  padding-right: 40px;
  display: grid;
  gap: 20px;
}

@media (min-width: 1200px) {
  .episodes-cards {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (min-width: 1200px) {
  .episodes-cards {
    grid-template-columns: repeat(2, 1fr);
  }
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
