<script setup>
import { ref } from 'vue';
import axios from 'axios';

const username = ref('k.temirov');
const password = ref('k.temirov@#333');

const login = async () => {
	const formData = new FormData();
	formData.append('username', username.value);
	formData.append('password', password.value);

	const { data } = await axios.post(
		import.meta.env.VITE_API_URL + '/services/platon-auth/api/login',
		formData,
		{
			headers: {
				'Device-Id':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			},
		}
	);

	console.log(data);
};
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
