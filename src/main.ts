import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useGenresStore } from '@/store/genres';
import { useMediaStore } from '@/store/media';
import { useToast } from '@/components/ui/toast/use-toast';

const pinia = createPinia();
const app = createApp(App);
const { toast } = useToast();

app.use(router);
app.use(pinia);

app.mount('#app');

const genresStore = useGenresStore();
const mediaStore = useMediaStore();

try {
  const results = await Promise.allSettled([
    genresStore.fetchMovieGenres(),
    genresStore.fetchTvGenres(),
    mediaStore.fetchNowPlaying(),
    mediaStore.fetchTopRated(),
    mediaStore.fetchUpcoming(),
    mediaStore.fetchTrendingTv(),
    mediaStore.fetchTrendingMovies()
  ]);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      throw new Error(`${result.reason}`);
    }
  });
} catch (error) {
  toast({
    title: 'An error occurred',
    description: `${error}`,
    variant: 'destructive'
  });
}
