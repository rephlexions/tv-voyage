import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useGenresStore } from '@/store/genres';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');

const genresStore = useGenresStore();
genresStore.fetchMovieGenres();
genresStore.fetchTvGenres();
