<script setup>
import { ref, onMounted } from 'vue';


const browserSupport = ref(true);
const cameraAvailable = ref(false);
const microphoneAvailable = ref(false);
const screenRecordingAvailable = ref(false);

const checkBrowserSupport = () => {
	browserSupport.value = navigator.mediaDevices && navigator.mediaDevices.enumerateDevices;
};
const checkCamera = async () => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		stream.getTracks().forEach(track => track.stop());
		cameraAvailable.value = true;
	} catch (error) {
		console.error('Камера не доступна', error);
		cameraAvailable.value = false;
	}
};

const checkMicrophone = async () => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		stream.getTracks().forEach(track => track.stop());
		microphoneAvailable.value = true;
	} catch (error) {
		console.error('Микрофон не доступен', error);
		microphoneAvailable.value = false;
	}
};


// const checkScreenRecording = async () => {
// 	try {
// 		if (browserSupport.value) {
// 			const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
// 			stream.getTracks().forEach(track => track.stop());
// 			screenRecordingAvailable.value = true;
// 		} else {
// 			console.error('Браузер не поддерживает запись экрана.');
// 		}
// 	} catch (error) {
// 		console.error('Ошибка при проверке записи экрана', error);
// 		screenRecordingAvailable.value = false;
// 	}
// };

const requestScreenRecording = async () => {
	try {
		if (browserSupport.value) {
			await navigator.mediaDevices.getDisplayMedia({ video: true });
			screenRecordingAvailable.value = true;
		} else {
			console.error('Браузер не поддерживает запись экрана.');
		}
	} catch (error) {
		console.error('Ошибка при запросе записи экрана', error);
	}
};



onMounted(async () => {
	await checkBrowserSupport();
	await checkCamera();
	await checkMicrophone();
	// await checkScreenRecording();
});

</script>

<template>
	<h1 class="text-2xl font-bold pb-8">Проверка оборудования </h1>
	<p> Подождите, пока система проверит компьютер и сеть, чтобы возможные технические проблемы не помешали мероприятию.</p>
	<ul class="my-8 flex flex-col gap-2">
		<li class="flex gap-2 items-center">
			<span :class="{
				'bg-red-500': !browserSupport, 'bg-green-500': browserSupport,
				'w-3 h-3 block rounded-full': true,
			}">
			</span>
			Проверка браузера
		</li>
		<li class="flex gap-2 items-center">
			<span :class="{
				'bg-red-500': !cameraAvailable, 'bg-green-500': cameraAvailable,
				'w-3 h-3 block rounded-full': true,
			}">
			</span>
			Проверка веб-камеры
		</li>
		<li class="flex gap-2 items-center">
			<span :class="{
				'bg-red-500': !microphoneAvailable, 'bg-green-500': microphoneAvailable,
				'w-3 h-3 block rounded-full': true,
			}">
			</span>
			Проверка микрофона
		</li>

		<li class="flex gap-2 items-center">
			<span :class="{
				'bg-red-500': !screenRecordingAvailable, 'bg-green-500': screenRecordingAvailable,
				'w-3 h-3 block rounded-full': true,
			}">
			</span>
			Запись экрана
		</li>
	</ul>

	<button @click="requestScreenRecording" class="border border-solid bg-gray-200 py-2 px-6 rounded">
		Запросить запись экрана
	</button>
</template>
