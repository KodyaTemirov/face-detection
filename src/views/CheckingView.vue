<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { checkBrowserSupport, checkCamera, checkMicrophone } from '@utils/checkDevice';
const emit = defineEmits(['change-step']);

const changeStep = () => {
	emit('change-step');
};

const browserSupport = ref(true);
const cameraAvailable = ref(false);
const microphoneAvailable = ref(false);
const isAllStatus = ref(true);


onMounted(async () => {
	browserSupport.value = await checkBrowserSupport();
	cameraAvailable.value = await checkCamera();
	microphoneAvailable.value = await checkMicrophone();


	if (browserSupport && cameraAvailable && microphoneAvailable) {
		isAllStatus.value = false;
	} else {
		isAllStatus.value = true;
	}

});
</script>

<template>
	<h1 class="text-2xl font-bold pb-8">Проверка оборудования</h1>
	<p>
		Подождите, пока система проверит компьютер и сеть, чтобы возможные
		технические проблемы не помешали мероприятию.
	</p>
	<ul class="my-8 flex flex-col gap-2">
		<li class="flex gap-2 items-center">
			<span :class="{
				'bg-red-500': !browserSupport,
				'bg-green-500': browserSupport,
				'w-3 h-3 block rounded-full': true,
			}">
			</span>
			Проверка браузера
		</li>
		<li class="flex gap-2 items-center">
			<span :class="{
				'bg-red-500': !cameraAvailable,
				'bg-green-500': cameraAvailable,
				'w-3 h-3 block rounded-full': true,
			}">
			</span>
			Проверка веб-камеры
		</li>
		<li class="flex gap-2 items-center">
			<span :class="{
				'bg-red-500': !microphoneAvailable,
				'bg-green-500': microphoneAvailable,
				'w-3 h-3 block rounded-full': true,
			}">
			</span>
			Проверка микрофона
		</li>
	</ul>
	<button @click="changeStep" :disabled="isAllStatus"
		class="bg-blue-500 py-2 px-6 rounded text-white float-right disabled:bg-slate-400 hover:bg-blue-700 my-8 ">
		Далее
	</button>
</template>
