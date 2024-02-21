import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import globalComponents from './components/global';
import { router } from './routes';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useAuthStore } from '@stores/AuthStore';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(createPinia());

const authStore = useAuthStore();
authStore.isAuthenticated = !!localStorage.getItem('auth_token');

app.use(router);
app.use(globalComponents).component('font-awesome-icon', FontAwesomeIcon);
app.use(Toast, {});
app.mount('#app');
