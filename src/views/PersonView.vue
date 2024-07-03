<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { tmdb } from '@/api/tmdb';
import { useToast } from '@/components/ui/toast/use-toast';
import dayjs from 'dayjs';
import type {
  JSONValue,
  MediaType,
  MovieCreditsResults,
  Person,
  TVCreditsResults
} from '@/types/types';
import { isError } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import MediaCarousel from '@/components/MediaCarousel.vue';
import CarouselItem from '@/components/ui/carousel/CarouselItem.vue';
import MediaCard from '@/components/MediaCard.vue';
import MovieRating from '@/components/MovieRating.vue';
import { Separator } from '@/components/ui/separator';
import { Gender } from '@/enums/enums';
import type { Movie } from '@/types/movie';
import type { TvShow } from '@/types/tvShow';

const route = useRoute();
const router = useRouter();
const { toast } = useToast();
const showBackButton = ref(false);
let personID = route.params.id as string;

let person = ref<Person | null>(null);
let movieCredits = ref<MovieCreditsResults | null>(null);
let tvCredits = ref<TVCreditsResults | null>(null);

const topRatedCredits = computed(() => {
  if (movieCredits.value && movieCredits.value.cast.length) {
    const credits = [...movieCredits.value.cast];
    credits.sort((a, b) => b.vote_average - a.vote_average);

    return credits.slice(0, 10);
  }
  return null;
});

function getDetails() {
  Promise.allSettled([
    tmdb.personDetail(personID),
    tmdb.personMovieCredits(personID),
    tmdb.personTvCredits(personID)
  ])
    .then((results) => {
      const handlers = [
        (value: JSONValue) => {
          person.value = value as Person;
        },
        (value: JSONValue) => {
          movieCredits.value = value as MovieCreditsResults;
        },
        (value: JSONValue) => {
          tvCredits.value = value as TVCreditsResults;
        }
      ];

      results.forEach((result, index) => {
        try {
          if (result.status === 'fulfilled') {
            const value = result.value;
            if (isError(value)) {
              throw new Error(value.message);
            } else {
              handlers[index](value);
            }
          } else if (result.status === 'rejected') {
            throw new Error(result.reason);
          }
        } catch (error) {
          toast({
            title: 'An error occurred',
            description: `${error}`,
            variant: 'destructive'
          });
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

function goBack() {
  router.go(-1);
}

function openDetailView(id: number, mediaType: MediaType = 'movie') {
  router.push({
    name: 'view',
    params: { id: id.toString(), type: mediaType }
  });
}

onMounted(() => {
  if (route.meta.fromWithinApp) {
    showBackButton.value = true;
  }
  getDetails();
});

watch(
  () => route.params.id,
  (newId) => {
    personID = newId as string;
    getDetails();
  }
);
</script>
<template>
  <main class="bg-primary p-16 pt-4">
    <Button v-if="showBackButton" @click="goBack" class="mb-4 dark">
      <Icon icon="akar-icons:arrow-left" />
    </Button>
    <div v-if="person" class="flex flex-row gap-16">
      <div class="flex flex-col gap-4">
        <div class="min-w-[300px] w-[300px]">
          <img
            class="object-cover aspect-2/3 rounded-lg"
            :src="`https://image.tmdb.org/t/p/w780/${person.profile_path}`"
          />
        </div>
        <div class="flex flex-col gap-1">
          <h3
            class="text-md font-semibold tracking-tight text-white transition-colors md:text-2xl mb-4"
          >
            Personal info
          </h3>
          <h4 class="text-md font-bold text-white">Known for</h4>
          <p>{{ person.known_for_department }}</p>
          <Separator />
          <h4 class="text-md font-bold text-white">Gender</h4>
          <p>{{ Gender[person.gender] }}</p>
          <Separator />
          <h4 class="text-md font-bold text-white">Birthday</h4>
          <p>{{ dayjs(person.birthday).format('MMMM D, YYYY') }}</p>
          <Separator />
          <h4 class="text-md font-bold text-white">Place of birth</h4>
          <p>{{ person.place_of_birth }}</p>
          <Separator v-if="person.deathday" />
          <h4 v-if="person.deathday" class="text-md font-bold text-white">Died</h4>
          <p v-if="person.deathday">{{ dayjs(person.deathday).format('MMMM D, YYYY') }}</p>
          <Separator />
          <h4 class="text-md font-bold text-white">Also Known As</h4>
          <p v-for="(item, index) in person.also_known_as" :key="index">{{ item }}</p>
        </div>
      </div>

      <div class="flex flex-col">
        <div class="mb-4">
          <h1
            class="text-xl font-bold tracking-tight text-white transition-colors first:mt-0 md:text-3xl"
          >
            {{ person.name }}
          </h1>
          <h3
            class="text-md font-semibold tracking-tight text-white transition-colors first:mt-0 md:text-2xl mt-7"
          >
            Biography
          </h3>
          <p class="text-sm text-white mt-1 w-[80%]">
            {{ person.biography }}
          </p>
        </div>
        <MediaCarousel>
          <template v-slot:carousel-title>
            <h2 class="mb-4 text-3xl font-semibold text-slate-100">Best known for</h2>
          </template>
          <template v-slot:carousel-item>
            <CarouselItem v-for="item in topRatedCredits" :key="item.id" class="basis-1/10">
              <MediaCard
                @click="openDetailView(item.id, item.media_type)"
                :path="item.backdrop_path"
                class="max-w-[220px]"
              >
                <template v-slot:card-footer>
                  <div>
                    <span class="text-slate-800 font-semibold h-[40px]">
                      {{ item.title }} ({{ dayjs(item.release_date, 'YYYY MMMM DD').year() }})
                    </span>
                    <MovieRating :rating="item.vote_average" />
                  </div>
                </template>
              </MediaCard>
            </CarouselItem>
          </template>
        </MediaCarousel>
      </div>
    </div>
  </main>
</template>
