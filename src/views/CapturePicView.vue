<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCamera, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { takePhoto } from '@utils/takePhoto';
import axios from 'axios';

library.add(faCamera, faCloudArrowUp);
const videoWidth = 552; // Желаемая ширина области видео
const videoHeight = 552; // Желаемая высота области видео
const webcam = ref(null);
const photo = ref(null);
const takePhotoStatus = ref(false);
const isFaceDetected = ref(false);

const emit = defineEmits(['change-step']);

const changeStep = () => {
	emit('change-step');
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

const getUserPhotos = async photoDataUrl => {
	const formData = new FormData();
	formData.append('photo', photoDataUrl);
	formData.append('token', 'e0296f10-7a7f-4d45-a63f-356b38355e9b');

	try {
		const { data } = await axios.post(
			'https://proctoring.platon.uz/services/platon-core/api/get/user_photos',
			formData
		);
		return data;
	} catch (error) {
		console.error(error);
		// Можно выбросить ошибку или вернуть что-то еще в зависимости от требований
		throw error;
	}
};

const takePhotoHandler = async () => {
	if (webcam.value) {
		photo.value = await takePhoto(webcam, videoWidth, videoHeight);
		takePhotoStatus.value = true;
	}
};

const checkPhotoRequest = async () => {
	const { data } = await getUserPhotos(photo.value);
	const { info } = data;
	const { image1, image2 } = info;
	isFaceDetected.value = true;
};
</script>

<template>
	<h1 class="text-2xl font-bold pb-8">Фотографирование лица</h1>

	<div class="flex justify-center">
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

			<button
				v-if="!takePhotoStatus"
				@click="takePhotoHandler"
				class="bg-black text-white absolute bottom-0 w-full p-4 hover:bg-blue-500"
			>
				<font-awesome-icon icon="fa-solid fa-camera" />

				Сделать снимок
			</button>

			<button
				v-else
				@click="checkPhotoRequest"
				class="bg-black text-white absolute bottom-0 w-full p-4 hover:bg-blue-500"
			>
				<font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
				Отправить снимок
			</button>
		</div>
	</div>
	<Button @click="changeStep" :disabled="!isFaceDetected"> Далее </Button>
</template>

<style>
.webcam-container {
	position: relative;
	width: 75%;
	padding-top: 75%;
}

.webcam-container video {
	position: absolute;
	width: 100%;
	height: 100%;
	object-fit: cover;
	top: 0;
}
</style>
