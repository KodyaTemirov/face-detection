<script setup>
import WebCam from './components/WebCam.vue';
import { ref, onMounted } from 'vue';


// Проверьте совместимую операционную систему и браузер(Chrome и т.Д.)
// Проверьте наличие веб - камеры(разрешение)
// Проверьте наличие микрофона
// Проверьте минимальную необходимую скорость в Интернете;

const checkCameraCompatibility = () => {
	return !!navigator.mediaDevices;
};

const checkCameraAvailability = async (cameraAvailable) => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });

		if (stream) {
			cameraAvailable.value = true;
			stream.getTracks().forEach(track => track.stop());
		}
	} catch (error) {
		console.error('Ошибка при проверке камеры:', error);
		cameraAvailable.value = false;
	}
};
const isCompatibleBrowser = checkCameraCompatibility();
const cameraAvailable = ref(false);

onMounted(() => {
	if (isCompatibleBrowser) {
		checkCameraAvailability(cameraAvailable);
	}
});


</script>

<template>
	<p v-if="isCompatibleBrowser">
		{{ cameraAvailable ? 'Веб-камера доступна!' : 'Веб-камера не доступна.' }}
	</p>
	<p v-else>
		Ваш браузер устарел. Пожалуйста, используйте современный браузер для проверки камеры.
	</p>
	<WebCam />
</template>
 