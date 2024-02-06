import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import globalComponents from './components/global';
import { router } from './routes';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App)
	.use(router)
	.component('font-awesome-icon', FontAwesomeIcon);

app.use(globalComponents);
app.mount('#app');
