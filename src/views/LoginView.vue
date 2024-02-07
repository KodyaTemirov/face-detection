<script setup>
import { ref, onBeforeMount } from 'vue';
import { useAuthStore } from '@stores/AuthStore';
import { useRouter } from 'vue-router';
const username = ref('k.temirov');
const password = ref('k.temirov@#333');
const router = useRouter();
const authStore = useAuthStore();

const redirectIsAuth = () => {
	if (authStore.isAuthenticated) {
		router.push('/');
	}
};

const login = async () => {
	if (!authStore.isAuthenticated) {
		await authStore.login(username.value, password.value);
		redirectIsAuth();
	}

};

onBeforeMount(() => {
	redirectIsAuth();
})

</script>

<template>
	<form @submit.prevent="login">
		<label for="username">Username:</label>
		<input type="text" id="username" v-model="username" />

		<label for="password">Password:</label>
		<input type="password" id="password" v-model="password" />

		<button type="submit">Login</button>
	</form>
</template>
