<script setup>
import { useAuthStore } from '@stores/AuthStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
	authStore.logout();
	router.push('/auth');

};

</script>

<template>
	<aside class="bg-white  left-0 top-0 h-svh flex flex-col items-center fixed">
		<router-link to="/">
			<div class="w-full text-center text-3xl font-bold py-8 border-b border-gray-200 border-solid text-blue-950">
				Proctoring
			</div>
		</router-link>
		<nav>
			<button @click="logout">
				Logout
			</button>
			<ul>

			</ul>
		</nav>
	</aside>
</template >


