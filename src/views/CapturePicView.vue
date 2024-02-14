<script setup>
import { ref, onMounted } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

library.add(faCamera);
const videoWidth = 552; // Желаемая ширина области видео
const videoHeight = 552; // Желаемая высота области видео
const webcam = ref(null);
const photo = ref(null);

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

const takePhoto = () => {
	if (webcam.value) {
		const canvas = document.createElement('canvas');
		canvas.width = videoWidth;
		canvas.height = videoHeight;
		const context = canvas.getContext('2d');
		context.drawImage(webcam.value, 0, 0, videoWidth * 1.3, videoHeight);
		const photoDataUrl = canvas.toDataURL('image/png');
		photo.value = photoDataUrl;
	}
};
</script>

<template>
	<h1 class="text-2xl font-bold pb-8">Фотографирование лица</h1>

	<div class="flex justify-center">
		<div class="webcam-container">
			<video ref="webcam" autoplay></video>
			<button @click="takePhoto" class="bg-black text-white absolute bottom-0 w-full p-4 hover:bg-blue-500">
				<font-awesome-icon icon="fa-solid fa-camera" />

				Сделать снимок</button>

		</div>
		<img v-if="photo" :src="photo" :style="{ width: `${videoSize}px`, height: `${videoSize}px` }" alt="Снимок">
	</div>
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
 