import { createWebHistory, createRouter } from 'vue-router';
import Home from '@views/HomeView.vue';
import Login from '@views/LoginView.vue';
import Checking from '@views/CheckingView.vue';
import NotFound from '@views/NotFoundView.vue';

import { useAuthStore } from '@stores/AuthStore';

const routes = [
	{
		path: '/user',
		name: 'Home',
		component: Home,
		meta: { requiresAuth: true }, // Защищенный маршрут
	},
	{
		path: '/user/:id',
		name: 'Proctoring',
		props: true,
		component: Home,
	},
	{
		path: '/start',
		name: 'Proctoring',
		component: Home,
		props: route => ({
			user_id: route.query.user_id,
			session_id: route.query.session_id,
		}),
	},
	{
		path: '/checking-device',
		name: 'Checking device',
		component: Checking,
		meta: { requiresAuth: true },
	},
	{
		path: '/auth',
		name: 'Auth',
		component: Login,
	},
	{
		path: '/:catchAll(.*)',
		component: NotFound,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Глобальный navigation guard для проверки аутентификации
router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();

	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next('/auth');
	} else {
		next();
	}
});

export { router };
