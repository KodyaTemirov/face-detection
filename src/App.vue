<script setup>
import WebCam from './components/WebCam.vue';

import { ref, onMounted } from 'vue';

const checkMediaDevicesCompatibility = () => {
	return !!navigator.mediaDevices;
};

const checkCameraAndMicrophoneAvailability = async (
	cameraAvailable,
	microphoneAvailable
) => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});

		if (stream) {
			cameraAvailable.value = true;
			microphoneAvailable.value = true;
			stream.getTracks().forEach(track => track.stop());
		}
	} catch (error) {
		console.error('Ошибка при проверке камеры и микрофона:', error);
		cameraAvailable.value = false;
		microphoneAvailable.value = false;
	}
};

const isCompatibleBrowser = checkMediaDevicesCompatibility();
const cameraAvailable = ref(false);
const microphoneAvailable = ref(false);

onMounted(() => {
	if (isCompatibleBrowser) {
		checkCameraAndMicrophoneAvailability(cameraAvailable, microphoneAvailable);
	}
});
</script>

<template>
	<p v-if="isCompatibleBrowser">
		{{
			cameraAvailable && microphoneAvailable
				? 'Веб-камера и микрофон доступны!'
				: 'Веб-камера или микрофон не доступны.'
		}}
	</p>
	<p v-else>
		Ваш браузер устарел. Пожалуйста, используйте современный браузер для
		проверки камеры и микрофона.
	</p>
	<WebCam />
</template>
