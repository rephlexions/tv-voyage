import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useGenresStore } from '@/store/genres';
import { useMediaStore } from '@/store/media';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');

const genresStore = useGenresStore();
const mediaStore = useMediaStore();
Promise.allSettled([
  genresStore.fetchMovieGenres(),
  genresStore.fetchTvGenres(),
  mediaStore.fetchNowPlaying(),
  mediaStore.fetchTopRated(),
  mediaStore.fetchUpcoming(),
  mediaStore.fetchTrendingTv(),
  mediaStore.fetchTrendingMovies()
]);
