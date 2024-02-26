<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue';
import { storeToRefs } from 'pinia';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCamera, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { takePhoto } from '@utils/takePhoto';
import { useFaceDetectionStore } from '@stores/FaceDetectionStore';
const props = defineProps(['id']);

const faceDetectionStore = useFaceDetectionStore();

library.add(faCamera, faCloudArrowUp);
const videoWidth = 552; // Желаемая ширина области видео
const videoHeight = 552; // Желаемая высота области видео
const webcam = ref(null);
const photo = ref(null);
const takePhotoStatus = ref(false);

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

const takePhotoHandler = async () => {
	if (webcam.value) {
		photo.value = await takePhoto(webcam, videoWidth, videoHeight);
		takePhotoStatus.value = true;
	}
};

const checkPhotoRequest = async () => {
	await faceDetectionStore.faceDetect(photo.value, props.id);
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
	<Button @click="changeStep" :disabled="!faceDetectionStore.isDetected">
		Далее
	</Button>
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
