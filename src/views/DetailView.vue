<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import type { Movie } from '@/types/movie';
import type {
  CreditsResults,
  MediaType,
  RecommendationsResults,
  ReviewResults,
  VideoResults
} from '@/types/types';
import type { TVShow } from '@/types/tvShow';
import { Icon } from '@iconify/vue';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MovieRating from '@/components/MovieRating.vue';
import { tmdb } from '@/api/tmdb';
import { storeToRefs } from 'pinia';
import { useGenresStore } from '@/store/genres';
import { useToast } from '@/components/ui/toast/use-toast';
import dayjs from 'dayjs';
import { isError } from '@/utils/utils';
import MediaCarousel from '@/components/MediaCarousel.vue';
import CarouselItem from '@/components/ui/carousel/CarouselItem.vue';
import MediaCard from '@/components/MediaCard.vue';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import Separator from '@/components/ui/separator/Separator.vue';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { toast } = useToast();
const genresStore = useGenresStore();
const { allGenres } = storeToRefs(genresStore);

let mediaID = route.params.id as string;
let mediaType: MediaType = route.params.type as MediaType;

let media = ref<Movie | TVShow | null>(null);
let videos = ref<VideoResults | null>(null);
let credits = ref<CreditsResults | null>(null);
let reviews = ref<ReviewResults | null>(null);
let recommendations = ref<RecommendationsResults | null>();

const accordionList = computed(() => {
  return reviews.value?.results.map((review) => ({
    value: review.id,
    title: review.author,
    content: review.content
  }));
});

const trailer = computed(() => {
  if (!videos.value) return;
  return videos.value.results.find((video) => video.type === 'Trailer');
});

const genres = computed(() => {
  if (!media.value) return;
  return media.value.genres.map((genre) => allGenres.value.find((g) => g.id === genre.id)?.name);
});

const directors = computed(() => {
  if (!credits.value) return;
  return credits.value.crew.filter((person) => person.job === 'Director');
});

const mediaTitle = computed(() => {
  if (isMovie(media.value)) {
    return `${media.value.title} (${dayjs(media.value.release_date).format('YYYY')})`;
  } else if (isTVShow(media.value)) {
    return `${media.value.name} (${dayjs(media.value.first_air_date).format('YYYY')})`;
  }
  return '';
});

function isMovie(value: any): value is Movie {
  return value && typeof value === 'object' && 'title' in value;
}

function isTVShow(value: any): value is TVShow {
  return value && typeof value === 'object' && 'name' in value;
}

function openDetailView(id: number, mediaType: MediaType = 'movie') {
  router.push({
    name: 'view',
    params: { id: id.toString(), type: mediaType }
  });
}

async function getDetails() {
  Promise.allSettled([
    tmdb.getDetails(mediaType, mediaID),
    tmdb.getVideos(mediaType, mediaID),
    tmdb.credits(mediaType, mediaID),
    tmdb.reviews(mediaType, mediaID),
    tmdb.recommendations(mediaType, mediaID)
  ])
    .then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const value = result.value;
          if (isError(value)) {
            throw new Error(value.message);
          } else {
            console.log(value, index);
            switch (index) {
              case 0:
                media.value = mediaType === 'movie' ? (value as Movie) : (value as TVShow);
                break;
              case 1:
                videos.value = value as VideoResults;
                break;
              case 2:
                credits.value = value as CreditsResults;
                break;
              case 3:
                reviews.value = value as ReviewResults;
                break;
              case 4:
                recommendations.value = value as RecommendationsResults;
                break;
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

watch(
  () => route.params.id,
  (newId) => {
    mediaID = newId as string;
    mediaType = route.params.type as MediaType;
    getDetails();
  }
);
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
            {{ mediaTitle }}
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
    <div class="p-16">
      <MediaCarousel>
        <template v-slot:carousel-title>
          <h2 class="mb-4 text-3xl font-semibold text-slate-100">Cast</h2>
        </template>
        <template v-slot:carousel-item>
          <CarouselItem
            v-for="item in credits?.cast.slice(0, 15)"
            :key="item.id"
            class="basis-1/10"
          >
            <MediaCard :path="item.profile_path" class="max-w-[120px]">
              <template v-slot:card-footer>
                <p class="text-slate-800 font-semibold">{{ item.name }}</p>
                <p class="text-slate-500">{{ item.character }}</p>
              </template>
            </MediaCard>
          </CarouselItem>
        </template>
      </MediaCarousel>
    </div>
    <div class="flex md:flex-row flex-col px-16 gap-16">
      <div class="basis-2/3 flex flex-col gap-16">
        <div>
          <h3 class="text-3xl font-semibold text-slate-100 p-4 pl-0">Reviews</h3>
          <Accordion type="single" class="w-full" collapsible>
            <AccordionItem
              v-for="item in accordionList?.slice(0, 6)"
              :key="item.value"
              :value="item.value"
            >
              <AccordionTrigger class="text-foreground">{{ item.title }}</AccordionTrigger>
              <AccordionContent>
                {{ item.content }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div>
          <MediaCarousel>
            <template v-slot:carousel-title>
              <h2 class="mb-4 text-3xl font-semibold text-slate-100">Recommendations</h2>
            </template>
            <template v-slot:carousel-item>
              <CarouselItem
                v-for="item in recommendations?.results.slice(0, 10)"
                :key="item.id"
                class="basis-1/10"
              >
                <MediaCard
                  @click="openDetailView(item.id, item.media_type as MediaType)"
                  :path="item.backdrop_path"
                  class="max-w-[120px]"
                >
                  <template v-slot:card-footer>
                    <p class="text-slate-800 font-semibold">{{ item.title }}</p>
                  </template>
                </MediaCard>
              </CarouselItem>
            </template>
          </MediaCarousel>
        </div>
      </div>
      <div v-if="media" class="basis-1/3">
        <h3 class="text-3xl font-semibold text-slate-100 p-4 pl-0">Details</h3>
        <Separator />
        <div v-if="directors" class="flex gap-2 items-center">
          <h6 class="text-md font-semibold text-slate-200 p-4">Director</h6>
          <div class="flex flex-row gap-1 h-min">
            <p v-for="(director, index) in directors" :key="index">
              {{ director.name }}{{ index < directors.length - 1 ? ', ' : '' }}
            </p>
          </div>
        </div>
        <Separator />
        <div class="flex gap-2 items-center">
          <h6 class="text-md font-semibold text-slate-200 p-4">Genres</h6>
          <div class="flex flex-row gap-1 h-min">
            <Badge v-for="(genre, index) in genres" :key="index" :variant="'secondary'">
              {{ genre }}
            </Badge>
          </div>
        </div>
        <Separator />
        <div class="flex gap-2 items-center">
          <h6 class="text-md font-semibold text-slate-200 p-4">Status</h6>
          <div class="flex flex-row gap-1 h-min">
            {{ media.status }}
          </div>
        </div>
        <Separator />
        <div class="flex gap-2 items-center">
          <h6 class="text-md font-semibold text-slate-200 p-4">
            {{ isMovie(media) ? 'Release date' : 'First air date' }}
          </h6>
          <div class="flex flex-row gap-1 h-min">
            {{
              isMovie(media)
                ? dayjs(media.release_date).format('MMMM DD, YYYY')
                : dayjs(media.first_air_date).format('MMMM DD, YYYY')
            }}
          </div>
        </div>
        <Separator />
        <div v-if="isMovie(media)" class="flex gap-2 items-center">
          <h6 class="text-md font-semibold text-slate-200 p-4">Runtime</h6>
          <div class="flex flex-row gap-1 h-min">{{ media.runtime.toFixed(0) }} mins</div>
        </div>
        <Separator />
        <div v-if="isMovie(media)" class="flex gap-2 items-center">
          <h6 class="text-md font-semibold text-slate-200 p-4">Budget</h6>
          <div class="flex flex-row gap-1 h-min">{{ media.budget }} mins</div>
        </div>
        <Separator />
        <div class="flex gap-2 items-center">
          <h6 class="text-md font-semibold text-slate-200 p-4">Spoken languages</h6>
          <div class="flex flex-row gap-1 h-min">
            <p v-for="(language, index) in media.spoken_languages" :key="index">
              {{ language.english_name }}{{ index < media.spoken_languages.length - 1 ? ', ' : '' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped></style>
