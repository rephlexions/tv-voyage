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
	VideoResults,
	ImageResults,
	JSONValue,
} from '@/types/types';
import type { TvShow } from '@/types/tvShow';
import { Icon } from '@iconify/vue';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MovieRating from '@/components/MovieRating.vue';
import ImageGallery from '@/components/ImageGallery.vue';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Separator from '@/components/ui/separator/Separator.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'vue-router';
import { isMovie, isTVShow } from '@/utils/utils';

const route = useRoute();
const router = useRouter();
const { toast } = useToast();
const genresStore = useGenresStore();
const { allGenres } = storeToRefs(genresStore);
const showBackButton = ref(false);

let mediaID = route.params.id as string;
let mediaType: MediaType = route.params.type as MediaType;
const dialogTrigger = ref<HTMLElement | null>(null);

let media = ref<Movie | TvShow | null>(null);
let videos = ref<VideoResults | null>(null);
let credits = ref<CreditsResults | null>(null);
let reviews = ref<ReviewResults | null>(null);
let recommendations = ref<RecommendationsResults | null>();
let images = ref<ImageResults | null>(null);

const accordionList = computed(() => {
	return reviews.value?.results.map((review) => ({
		value: review.id,
		title: review.author,
		content: review.content,
	}));
});

const trailer = computed(() => {
	if (!videos.value) return;
	return videos.value.results.find((video) => video.type === 'Trailer');
});

const genres = computed(() => {
	if (!media.value) return;
	return media.value.genres.map((genre: { id: number }) => allGenres.value.find((g) => g.id === genre.id)?.name);
});

const directors = computed(() => {
	if (!credits.value) return;
	return credits.value.crew.filter((person) => person.job === 'Director');
});

const createdBy = computed(() => {
	if (!media.value) return;
	return (media.value as TvShow).created_by;
});

const mediaTitle = computed(() => {
	if (isMovie(media.value)) {
		return `${media.value.title} (${dayjs(media.value.release_date).format('YYYY')})`;
	} else if (isTVShow(media.value)) {
		return `${media.value.name} (${dayjs(media.value.first_air_date).format('YYYY')})`;
	}
	return '';
});
const cast = computed(() => {
	if (!credits?.value) return;
	return credits?.value.cast.slice(0, 20);
});

const backdrops = computed(() => {
	if (!images?.value) return;
	return images?.value.backdrops.slice(0, 10);
});

function openDetailView(id: number, mediaType: MediaType = 'movie') {
	router.push({
		name: 'view',
		params: { id: id.toString(), type: mediaType },
	});
}

function openPersonDetailView(id: number) {
	router.push({
		name: 'person',
		params: { id: id.toString() },
	});
}

function goBack() {
	router.go(-1);
}

async function fetchVideos() {
	if (!videos.value) {
		try {
			await tmdb.getVideos(mediaType, mediaID).then((results) => {
				if (isError(results)) {
					throw new Error(results.message);
				}
				videos.value = results as VideoResults;
			});
		} catch {
			toast({
				title: 'An error occurred',
				description: 'Failed to fetch videos',
				variant: 'destructive',
			});
		}
	}
	dialogTrigger.value?.click();
}

function getDetails() {
	Promise.allSettled([
		tmdb.getDetails(mediaType, mediaID),
		tmdb.credits(mediaType, mediaID),
		tmdb.reviews(mediaType, mediaID),
		tmdb.recommendations(mediaType, mediaID),
		tmdb.images(mediaType, mediaID),
	])
		.then((results) => {
			const handlers = [
				(value: JSONValue) => {
					media.value = mediaType === 'movie' ? (value as Movie) : (value as TvShow);
				},
				(value: JSONValue) => {
					credits.value = value as CreditsResults;
				},
				(value: JSONValue) => {
					reviews.value = value as ReviewResults;
				},
				(value: JSONValue) => {
					recommendations.value = value as RecommendationsResults;
				},
				(value: JSONValue) => {
					images.value = value as ImageResults;
				},
			];

			results.forEach((result, index) => {
				try {
					if (result.status === 'fulfilled') {
						if (isError(result.value)) {
							throw new Error(result.value.message);
						} else {
							handlers[index](result.value);
						}
					} else if (result.status === 'rejected') {
						throw new Error(result.reason);
					}
				} catch (error) {
					toast({
						title: 'A server error occurred',
						description: `${error}`,
						variant: 'destructive',
					});
				}
			});
		})
		.catch((error) => {
			toast({
				title: 'A network error occurred',
				description: `${error}`,
				variant: 'destructive',
			});
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
		mediaID = newId as string;
		mediaType = route.params.type as MediaType;
		getDetails();
	},
);
</script>

<template>
	<main class="bg-primary pb-16 pt-4">
		<Button v-if="showBackButton" @click="goBack" class="mx-16 mb-4 dark">
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
				loading="lazy"
				alt="Movie cover"
			/>
			<div class="absolute left-24 right-24 top-8 flex h-3/4 gap-4 sm:top-16">
				<Card class="w-auto md:max-w-[264px] aspect-2/3 h-min min-h-[180px]">
					<CardContent class="w-full h-full p-0">
						<img
							class="h-full w-full rounded-lg object-cover"
							:src="`https://image.tmdb.org/t/p/w342/${media.poster_path}`"
							loading="lazy"
						/>
					</CardContent>
				</Card>
				<div class="flex flex-col gap-3">
					<h2 class="scroll-m-20 text-xl font-semibold tracking-tight text-white transition-colors first:mt-0 md:text-3xl">
						{{ mediaTitle }}
					</h2>
					<div class="flex gap-1 flex-row flex-wrap">
						<Badge v-for="(genre, index) in genres" :key="index" :variant="'secondary'">
							{{ genre }}
						</Badge>
					</div>
					<Badge :variant="'secondary'" class="max-w-fit">
						<MovieRating v-if="media.vote_average" :rating="media.vote_average" />
					</Badge>
					<Button @click="fetchVideos" class="max-w-fit" variant="secondary">View trailer</Button>
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
					<CarouselItem v-for="item in cast" :key="item.id" class="basis-1/10">
						<MediaCard @click="openPersonDetailView(item.id)" class="max-w-[120px]">
							<template v-slot:card-content>
								<img
									v-if="item.profile_path"
									class="max-h-[332px] rounded-lg rounded-b-none object-cover aspect-2/3"
									:src="`https://image.tmdb.org/t/p/w780/${item.profile_path}`"
									loading="lazy"
								/>
								<img v-else src="../assets/user-grey.svg" />
							</template>
							<template v-slot:card-footer>
								<div class="h-[80px] flex flex-col justify-between">
									<p class="text-slate-800 font-semibold">{{ item.name }}</p>
									<p class="text-slate-500">{{ item.character }}</p>
								</div>
							</template>
						</MediaCard>
					</CarouselItem>
				</template>
			</MediaCarousel>
		</div>
		<div class="flex md:flex-row flex-col px-16 gap-16">
			<div class="basis-2/3 flex flex-col gap-16">
				<ImageGallery v-if="backdrops" :images="backdrops" />
				<div v-if="accordionList?.length">
					<h3 class="text-3xl font-semibold text-slate-100 p-4 pl-0">User Reviews</h3>
					<Accordion type="single" class="w-full" collapsible>
						<AccordionItem v-for="item in accordionList?.slice(0, 5)" :key="item.value" :value="item.value">
							<AccordionTrigger class="text-foreground">{{ item.title }} </AccordionTrigger>
							<AccordionContent>
								<ScrollArea class="h-[400px] rounded-md p-4">
									<span v-html="item.content"></span>
								</ScrollArea>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
				<MediaCarousel v-if="recommendations?.results.length" class="w-[50%]">
					<template v-slot:carousel-title>
						<h2 class="mb-4 text-3xl font-semibold text-slate-100">Recommendations</h2>
					</template>
					<template v-slot:carousel-item>
						<CarouselItem v-for="item in recommendations?.results.slice(0, 10)" :key="item.id" class="basis-1/10">
							<MediaCard @click="openDetailView(item.id, item.media_type)" :path="item.backdrop_path" class="max-w-[200px]">
								<template v-slot:card-content>
									<img
										v-if="item.backdrop_path"
										class="max-h-[332px] rounded-lg rounded-b-none object-cover aspect-2/3"
										:src="`https://image.tmdb.org/t/p/w780/${item.backdrop_path}`"
										loading="lazy"
									/>
									<img
										v-else
										src="../assets/no-poster.png"
										class="h-[112px] max-h-[112px] w-[200px] object-cover aspect-2/3 rounded-lg rounded-b-none"
									/>
								</template>
								<template v-slot:card-footer>
									<div class="h-[60px] flex flex-col justify-between">
										<span class="text-slate-800 font-semibold">
											{{ item.name || item.title }}
										</span>
										<MovieRating v-if="item.vote_average" :rating="item.vote_average" />
									</div>
								</template>
							</MediaCard>
						</CarouselItem>
					</template>
				</MediaCarousel>
			</div>
			<div v-if="media" class="basis-1/3">
				<h3 class="text-3xl font-semibold text-slate-100 p-4 pl-0">Details</h3>
				<Separator v-if="directors?.length" />
				<div v-if="directors?.length" class="flex gap-2 items-center">
					<h6 class="text-md font-semibold text-slate-200 p-4">Director</h6>
					<div class="flex flex-row gap-1 h-min">
						<p v-for="(director, index) in directors" :key="index">
							{{ director.name }}{{ index < directors.length - 1 ? ', ' : '' }}
						</p>
					</div>
				</div>
				<Separator v-if="createdBy?.length" />
				<div v-if="createdBy?.length" class="flex gap-2 items-center">
					<h6 class="text-md font-semibold text-slate-200 p-4">Created by</h6>
					<div class="flex flex-row gap-1 h-min">
						<p v-for="(item, index) in createdBy" :key="index">{{ item.name }}{{ index < createdBy.length - 1 ? ', ' : '' }}</p>
					</div>
				</div>
				<Separator />
				<div class="flex gap-2 items-center">
					<h6 class="text-md font-semibold text-slate-200 p-4">Genres</h6>
					<div class="flex flex-row gap-1 h-min flex-wrap p-4">
						<Badge v-for="(genre, index) in genres" :key="index" class="whitespace-nowrap" :variant="'secondary'">
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
				<Separator v-if="isTVShow(media)" />
				<div v-if="isTVShow(media)" class="flex gap-2 items-center">
					<h6 class="text-md font-semibold text-slate-200 p-4">Seasons</h6>
					<div class="flex flex-row gap-1 h-min">
						{{ media.number_of_seasons }}
					</div>
				</div>
				<Separator v-if="isTVShow(media)" />
				<div v-if="isTVShow(media)" class="flex gap-2 items-center">
					<h6 class="text-md font-semibold text-slate-200 p-4">Seasons</h6>
					<div class="flex flex-row gap-1 h-min">
						{{ media.number_of_episodes }}
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
				<Separator v-if="isMovie(media)" />
				<div v-if="isMovie(media)" class="flex gap-2 items-center">
					<h6 class="text-md font-semibold text-slate-200 p-4">Runtime</h6>
					<div class="flex flex-row gap-1 h-min">{{ media.runtime.toFixed(0) }} mins</div>
				</div>
				<Separator v-if="isMovie(media)" />
				<div v-if="isMovie(media)" class="flex gap-2 items-center">
					<h6 class="text-md font-semibold text-slate-200 p-4">Budget</h6>
					<div class="flex flex-row gap-1 h-min">
						{{
							new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
							}).format(media.budget)
						}}
					</div>
				</div>
				<Separator />
				<div class="flex gap-2 items-center">
					<h6 class="text-md font-semibold text-slate-200 p-4">Spoken languages</h6>
					<div class="flex flex-row gap-1 h-min flex-wrap">
						<p v-for="(language, index) in media.spoken_languages" :key="index">
							{{ language.english_name }}{{ index < media.spoken_languages.length - 1 ? ', ' : '' }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</main>
	<Dialog>
		<DialogTrigger as-child>
			<div ref="dialogTrigger"></div>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[80vw] h-[80vh] p-8">
			<lite-youtube
				class="w-full h-full max-w-full"
				:videoid="trailer?.key"
				params="controls=1&autoplay=1&mute=0&rel=0"
				width="100%"
				height="100%"
			></lite-youtube>
		</DialogContent>
	</Dialog>
</template>
<style scoped></style>
