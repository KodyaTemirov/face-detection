import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
const apiUrl = import.meta.env.VITE_API_URL;

const toast = useToast();

export const useFaceDetectionStore = defineStore('faceDetectionStore', () => {
	const similarity = ref(null);
	const attempt_id = ref(null);
	const isDetected = ref(null);

	const faceDetect = async (image, token, session_id) => {
		const formData = new FormData();
		formData.append('photo', image);
		formData.append('token', token);
		formData.append('session_id', session_id);

		try {
			const {
				data: { data: responseData },
			} = await axios.post(
				apiUrl + '/services/platon-core/api/get/user_photos',
				formData
			);

			if (!responseData.ai.status) {
				throw new Error(responseData.ai.message);
			} else if (responseData.ai.similarity > 0.26) {
				throw new Error('Картинки не совпадают. Пожалуйста, попробуйте снова.');
			} else {
				isDetected.value = responseData.ai.similarity <= 0.26;
			}
			similarity.value = responseData.ai.similarity;
			attempt_id.value = responseData.create.id;
		} catch (error) {
			hasError.value = true;
			toast.error(error.message, {
				timeout: 4000,
			});
		}
	};

	const faceUpdate = async (image, id) => {
		try {
			const formData = new FormData();
			formData.append('photo', image);
			formData.append('attempt_id', id);

			const {
				data: { data: responseData },
			} = await axios.post(
				apiUrl + '/services/platon-core/api/update/user_photo',
				formData
			);

			if (!responseData.ai.status) {
				throw new Error(responseData.ai.message);
			} else if (responseData.ai.similarity > 0.26) {
				throw new Error('Rasmlar mos tushmadi.');
			} else {
				isDetected.value = responseData.ai.similarity <= 0.26;
			}
			similarity.value = responseData.ai.similarity;
		} catch (error) {
			toast.error(error.message, {
				timeout: 4000,
			});
		}
	};

	return { similarity, attempt_id, isDetected, faceDetect, faceUpdate };
});
