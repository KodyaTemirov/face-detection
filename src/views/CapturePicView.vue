<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCamera, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { takePhoto } from '@utils/takePhoto';
import { useFaceDetectionStore } from '@stores/FaceDetectionStore';
import { useToast, POSITION } from 'vue-toastification';

const props = defineProps(['id', 'session_id']);

const toast = useToast();
const faceDetectionStore = useFaceDetectionStore();

library.add(faCamera, faCloudArrowUp);
const videoWidth = 297; // Желаемая ширина области видео
const videoHeight = 297; // Желаемая высота области видео
const webcam = ref(null);
const photo = ref(null);
const takePhotoStatus = ref(false);
const photoLoading = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;

const emit = defineEmits(['change-step']);

const startTest = async attempt_id => {
	const formData = new FormData();
	formData.append('attempt_id', attempt_id);

	try {
		const { data } = await axios.put(
			apiUrl + '/services/platon-core/api/update/attempt_status',
			formData
		);

		emit('change-step');
	} catch ({ response: { data } }) {
		toast.error(data.message, {
			timeout: 4000,
			position: POSITION.BOTTOM_CENTER,
		});
	}
};

const changeStep = async () => {
	await startTest(faceDetectionStore.attempt_id);
};

onMounted(() => {
	setupWebcam();
});

const setupWebcam = async () => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });

		if (webcam.value) {
			webcam.value.srcObject = stream;
		}
	} catch (error) {
		console.error('Ошибка при доступе к веб-камере:', error);
	}
};

const takePhotoHandler = async () => {
	if (webcam.value) {
		photo.value = await takePhoto(webcam, videoWidth, videoHeight);
		takePhotoStatus.value = true;
	}
	checkPhotoRequest();
};

const checkPhotoRequest = async () => {
	photoLoading.value = true;
	await faceDetectionStore.faceDetect(photo.value, props.id, props.session_id);

	if (
		faceDetectionStore.similarity > 0.26 ||
		!faceDetectionStore.isDetected ||
		faceDetectionStore.hasError
	) {
		photo.value = null;
		takePhotoStatus.value = false;
	}
	photoLoading.value = false;
};
</script>

<template>
	<Card
		title="Фотографирование лица"
		class="w-full flex items-center flex-col mt-7"
	>
		<div class="webcam-container">
			<video
				ref="webcam"
				autoplay
				:width="videoWidth"
				:height="videoHeight"
			></video>
			<img
				v-if="photo"
				:src="photo"
				alt="Снимок"
				class="absolute top-0 left-0"
			/>

			<div
				v-if="photoLoading"
				class="bg-black bg-opacity-25 text-white absolute bottom-0 p-4 hover:bg-blue-500 w-full h-full flex justify-center items-center"
			>
				<div class="loader bottom-0 w-full p-4"></div>
			</div>
		</div>

		<button
			@click="takePhotoHandler"
			class="button mt-7 flex justify-center gap-1"
			:class="{ active: faceDetectionStore.isDetected }"
			:disabled="faceDetectionStore.isDetected"
		>
			<span
				v-if="!faceDetectionStore.isDetected"
				class="flex justify-center gap-1"
			>
				<Icon name="photo" />
				Сделать снимок
			</span>
			<span v-else class="flex justify-center gap-1">
				<Icon name="check" />
				Проверка пройдена
			</span>
		</button>
	</Card>
	<div class="flex justify-center"></div>
	<Button
		class="mt-2"
		@click="changeStep"
		:disabled="!faceDetectionStore.isDetected"
	>
		Далее
	</Button>
</template>

<style scoped>
.button {
	border: 1px solid var(--accent-main);
	border-radius: 200px;
	font-family: var(--font-family);
	font-weight: 500;
	font-size: 14px;
	line-height: 100%;
	color: var(--accent-main);
	background: var(--accent-button);
	padding: 16px 32px;
	width: 100%;
}
.active {
	background: var(--status-succes);
	border: 1px solid var(--status-succes);
	font-family: var(--font-family);
	font-weight: 500;
	font-size: 14px;
	line-height: 100%;
	color: var(--accent-button);
}
.webcam-container {
	border-radius: 100%;
	overflow: hidden;
	position: relative;
	width: 297px;
	padding-top: 297px;
}

.webcam-container video {
	position: absolute;
	width: 100%;
	height: 100%;
	object-fit: cover;
	top: 0;
}
</style>
