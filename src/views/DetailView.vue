<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { Movie } from '@/types/media';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Icon } from '@iconify/vue';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MovieRating from '@/components/MovieRating.vue';
import { tmdb } from '@/api/tmdb';
import { storeToRefs } from 'pinia';
import { useGenresStore } from '@/store/genres';
import { useToast } from '@/components/ui/toast/use-toast';
import type { MediaType, VideoResults } from '@/types/types';
import type { TVShow } from '@/types/tvShow';

const route = useRoute();
const { toast } = useToast();

const mediaID = route.params.id as string;
const mediaType: MediaType = route.params.type as MediaType;

let media = ref<Movie | null>(null);
let videos = ref<VideoResults | null>(null);
const genresStore = useGenresStore();
const { allGenres } = storeToRefs(genresStore);

const trailer = computed(() => {
  if (!videos.value) return;
  return videos.value.results.find((video) => video.type === 'Trailer');
});

const genres = computed(() => {
  if (!media.value) return;
  return media.value.genres.map((genre) => allGenres.value.find((g) => g.id === genre.id)?.name);
});

function isError(value: any): value is Error {
  return value instanceof Error;
}

async function getDetails() {
  Promise.allSettled([tmdb.getDetails(mediaType, mediaID), tmdb.getVideos(mediaType, mediaID)])
    .then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const value = result.value;
          if (isError(value)) {
            throw new Error(value.message);
          } else {
            if (index === 0) {
              media.value = mediaType === 'movie' ? (value as Movie) : (value as TVShow);
            } else {
              videos.value = value as VideoResults;
            }
          }
        } else if (result.status === 'rejected') {
          throw new Error(result.reason);
        }
      });
    })
    .catch((error) => {
      toast({
        title: 'An error occurred',
        description: `${error}`,
        variant: 'destructive'
      });
    });
}
onMounted(() => {
  getDetails();
});
</script>

<template>
  <main class="bg-primary">
    <Button @click="$router.back()" class="mx-16 my-4 dark">
      <Icon icon="akar-icons:arrow-left" />
    </Button>
    <div v-if="media" class="relative h-[500px]">
      <img
        class="h-full w-full object-cover object-center brightness-50"
        :srcset="
          `https://image.tmdb.org/t/p/original${media.backdrop_path} 1080w` +
          ', ' +
          `https://image.tmdb.org/t/p/w780${media.backdrop_path} 768w`
        "
        alt="Movie cover"
      />
      <div class="absolute left-24 right-24 top-8 flex h-3/4 gap-4 sm:top-16">
        <Card class="aspect-2/3 min-h-[275px] w-auto md:max-w-[264px]">
          <CardContent class="w-full p-0">
            <img
              class="h-full w-full rounded-lg object-cover"
              :src="`https://image.tmdb.org/t/p/w342/${media.poster_path}`"
            />
          </CardContent>
        </Card>
        <div class="flex flex-col gap-3">
          <h2
            class="scroll-m-20 text-xl font-semibold tracking-tight text-white transition-colors first:mt-0 md:text-3xl"
          >
            {{ media.title }} ({{ media.release_date?.split('-')[0] }})
          </h2>
          <div class="flex gap-1 flex-row flex-nowrap">
            <Badge v-for="(genre, index) in genres" :key="index" :variant="'secondary'">
              {{ genre }}
            </Badge>
          </div>
          <MovieRating v-if="media.vote_average" :rating="media.vote_average" />
          <Dialog>
            <DialogTrigger as-child>
              <Button class="max-w-fit" variant="secondary">View trailer</Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[80vw] h-[80vh] p-8">
              <iframe
                class="w-full h-full"
                :src="`https://www.youtube.com/embed/${trailer?.key}`"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </DialogContent>
          </Dialog>
          <h4 class="text-md italic text-slate-300">{{ media.tagline }}</h4>
          <p class="text-white text-sm max-w-lg overflow-scroll">{{ media.overview }}</p>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped></style>
