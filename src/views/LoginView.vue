<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@stores/AuthStore';

const username = ref('k.temirov');
const password = ref('k.temirov@#333');
const authStore = useAuthStore();

const login = () => {
	authStore.login(username.value, password.value);
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
