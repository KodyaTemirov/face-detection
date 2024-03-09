import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useToast, POSITION } from 'vue-toastification';
const apiUrl = import.meta.env.VITE_API_URL;
const toast = useToast();

export const useCheatingStore = defineStore('cheatingStore', () => {
	const allCheating = ref(null);
	const currentScore = ref(100);
	const cheating = ref(null);
	const monitorCount = ref(1);
	const isMonitorCheating = ref(false);

	const addCheating = async (code, attempt_id) => {
		const formData = new FormData();
		formData.append('code', code);
		formData.append('attempt_id', attempt_id);

		try {
			const {
				data: { data: responseData },
			} = await axios.post(
				apiUrl + '/services/platon-core/api/add/cheating_case',
				formData
			);
			const { score, description } = responseData;
			currentScore.value = score;
			allCheating.value = description;
			console.log(description);
		} catch (error) {
			toast.error(error.message, {
				timeout: 4000,
			});
		}
	};

	const updateMonitorCount = count => {
		if (count > 1) {
			isMonitorCheating.value = false;
			monitorCount.value = count;
		} else {
			monitorCount.value = count;
			isMonitorCheating.value = true;
		}
	};

	return {
		cheating,
		currentScore,
		allCheating,
		monitorCount,
		isMonitorCheating,
		addCheating,
		updateMonitorCount,
	};
});
