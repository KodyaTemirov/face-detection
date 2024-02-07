import { createWebHistory, createRouter } from 'vue-router';
import Home from '@views/HomeView.vue';
import Login from '@views/LoginView.vue';
import { useAuthStore } from '@stores/AuthStore';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: { requiresAuth: true }, // Защищенный маршрут
	},
	{
		path: '/auth',
		name: 'Auth',
		component: Login,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Глобальный navigation guard для проверки аутентификации
router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();
	console.log(authStore.isAuthenticated);

	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next('/auth');
	} else {
		next();
	}
});

export { router };
