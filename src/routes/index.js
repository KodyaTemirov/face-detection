import { createWebHistory, createRouter } from 'vue-router';
import Home from '@views/HomeView.vue';
import Login from '@views/LoginView.vue';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/auth',
		name: 'Auth',
		component: Login,
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
