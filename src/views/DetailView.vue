<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { Movie } from '@/types/movie';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MovieRating from '@/components/MovieRating.vue';
import { tmdb } from '@/api/tmdb';
import { storeToRefs } from 'pinia';
import { useGenresStore } from '@/store/genres';
import { useToast } from '@/components/ui/toast/use-toast';
import type { VideoResults } from '@/types/types';

const route = useRoute();
const { toast } = useToast();

const mediaID = route.params.id as string;
let movie = ref<Movie | null>(null);
let videos = ref<VideoResults | null>(null);
const genresStore = useGenresStore();
const { allGenres } = storeToRefs(genresStore);

function isError(value: any): value is Error {
  return value instanceof Error;
}

async function getDetails() {
  Promise.allSettled([tmdb.getDetails('movie', mediaID), tmdb.getVideos('movie', mediaID)])
    .then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const value = result.value;
          if (isError(value)) {
            throw new Error(value.message);
          } else {
            if (index === 0) {
              movie.value = value as Movie;
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
    <div v-if="movie" class="relative h-[500px]">
      <img
        class="h-full w-full object-cover object-center brightness-50"
        :srcset="
          `https://image.tmdb.org/t/p/original${movie.backdrop_path} 1080w` +
          ', ' +
          `https://image.tmdb.org/t/p/w780${movie.backdrop_path} 768w`
        "
        alt="Movie cover"
      />
      <div class="absolute left-24 right-24 top-8 flex h-3/4 gap-4 sm:top-16">
        <Card class="aspect-2/3 min-h-[275px] w-auto md:max-w-[264px]">
          <CardContent class="w-full p-0">
            <img
              class="h-full w-full rounded-lg object-cover"
              :src="`https://image.tmdb.org/t/p/w342/${movie.poster_path}`"
            />
          </CardContent>
        </Card>
        <div class="flex flex-col gap-3">
          <h2
            class="scroll-m-20 text-xl font-semibold tracking-tight text-white transition-colors first:mt-0 md:text-3xl"
          >
            {{ movie.title }} ({{ movie.release_date?.split('-')[0] }})
          </h2>
          <div class="flex gap-1 flex-row flex-nowrap">
            <Badge v-for="(item, index) in movie.genres" :key="index" :variant="'secondary'">
              <!-- TODO: make it computed? -->
              {{ allGenres.find((genre) => genre.id === item.id)?.name }}
            </Badge>
          </div>
          <MovieRating v-if="movie.vote_average" :rating="movie.vote_average" />
          <Dialog>
            <DialogTrigger as-child>
              <Button class="max-w-fit" variant="secondary">View trailer</Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[80vw] h-[80vh] p-8">
              <iframe
                class="w-full h-full"
                :src="`https://www.youtube.com/embed/${videos?.results.find((video) => video.type === 'Trailer')?.key}`"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </DialogContent>
          </Dialog>
          <h4 class="text-md italic text-slate-300">{{ movie.tagline }}</h4>
          <p class="text-white text-sm max-w-lg overflow-scroll">{{ movie.overview }}</p>
        </div>
      </div>
    </div>
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
  align-movies: flex-start;
  gap: 8px;
}

.show-info__list-movie {
  display: flex;
  justify-content: space-between;
  align-movies: center;
  gap: 16px;
}

.show-info__rating {
  display: flex;
  align-movies: center;
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
