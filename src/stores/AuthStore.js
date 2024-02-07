import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('authStore', {
	state: () => ({
		isAuthenticated: false,
		user: null,
	}),
	actions: {
		async login(username, password) {
			try {
				const formData = new FormData();
				formData.append('username', username);
				formData.append('password', password);

				const { data } = await axios.post(
					'api/services/platon-auth/api/login',
					formData,
					{
						headers: {
							'Device-Id':
								'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
						},
					}
				);

				const decoded = jwtDecode(data.data.access_token);
				const userToken = data.data.access_token;

				this.isAuthenticated = true;
				this.user = { ...decoded, ...userToken };
			} catch (error) {
				console.log(
					error.response ? error.response.data.message : 'Something went wrong'
				);
			}
		},
		logout() {
			this.isAuthenticated = false;
			this.user = null;
		},
	},
});
