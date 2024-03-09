import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
const apiUrl = import.meta.env.VITE_API_URL;

export const useResultStore = defineStore('resultStore', () => {
	const result = ref(null);
	const isFinished = ref(null);

	const finishHandler = async attempt_id => {
		try {
			const formData = new FormData();
			formData.append('attempt_id', attempt_id);

			const {
				data: { data: responseData },
			} = await axios.post(
				apiUrl + '/services/platon-core/api/finish/attempt',
				formData
			);

			result.value = responseData;
			isFinished.value = true;
		} catch (error) {
			console.log(error);
		}
	};

	return {
		result,
		isFinished,
		finishHandler,
	};
});
