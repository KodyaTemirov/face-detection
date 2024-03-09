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
import { createI18n } from 'vue-i18n';
import { languages, defaultLocale } from './locales';

const i18n = createI18n({
	legacy: false,
	locale: defaultLocale,
	fallbackLocale: 'ru',
	messages: {
		...languages,
	},
});

const app = createApp(App);

app.use(i18n);
app.use(createPinia());

const authStore = useAuthStore();
authStore.isAuthenticated = !!localStorage.getItem('auth_token');

app.use(router);
app.use(globalComponents).component('font-awesome-icon', FontAwesomeIcon);
app.use(Toast, {});
app.mount('#app');
