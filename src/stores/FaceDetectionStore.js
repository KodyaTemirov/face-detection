import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useToast, POSITION } from 'vue-toastification';
import { imageURLtoBlob } from '@utils/imageURLtoBlob';


const apiUrl = import.meta.env.VITE_API_URL;
const toast = useToast();

export const useFaceDetectionStore = defineStore('faceDetectionStore', () => {
	const similarity = ref(null);
	const attempt_id = ref(null);
	const isDetected = ref(null);
	const hasError = ref(null);
	const userMainImageURL = ref(null);

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
			} else if (responseData.ai.similarity > 0.30) {
				throw new Error(`Rasmlar mos kelmadi. Qayta urinib ko'ring `);
			} else {
				isDetected.value = responseData.ai.similarity <= 0.30;

				if(isDetected.value){
					// Если проверка пройдена, из ссылки берем данные картинки(file и base64 картинки) и записываем. Потом в странице тестирование картинку из потока сравниваем с этой картинкой  
					try {
						userMainImageURL.value = responseData.info.image1;
					}
					catch(error){
						console.error(error);
					}
				}

			}
			similarity.value = responseData.ai.similarity;
			attempt_id.value = responseData.create.id;
		} catch (error) {
			hasError.value = true;

			toast.error(error.message, {
				timeout: 4000,
				position: POSITION.BOTTOM_CENTER,
			});
		}
	};
	const addCheating = async code => {
		const formData = new FormData();

		formData.append('code', code);
		formData.append('attempt_id', attempt_id.value);

		try {
			const {
				data: { data: responseData },
			} = await axios.post(
				apiUrl + '/services/platon-core/api/add/cheating_case',
				formData
			);
		} catch (error) {
			toast.error(error.message, {
				timeout: 4000,
				position: POSITION.BOTTOM_CENTER,
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
				addCheating('c5', attempt_id);
				throw new Error('Rasmlar mos kelmadi!');
			} else {
				isDetected.value = responseData.ai.similarity <= 0.26;
			}
			similarity.value = responseData.ai.similarity;
		} catch (error) {
			toast.error(error.message, {
				timeout: 4000,
				position: POSITION.BOTTOM_CENTER,
			});
		}
	};

	return { similarity, attempt_id, isDetected, userMainImageURL, faceDetect, faceUpdate };
});
