<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

import {
	checkBrowserSupport,
	checkCamera,
	checkMicrophone,
	checkDisplays
} from '@utils/checkDevice';
const emit = defineEmits(['change-step']);

const changeStep = () => {
	emit('change-step');
};


const toast = useToast();
const browserSupport = ref(true);
const cameraAvailable = ref(false);
const microphoneAvailable = ref(false);
const moreDisplays = ref(false);
const isAllStatus = ref(true);
const checkingEnd = ref(false);


onMounted(async () => {
	browserSupport.value = await checkBrowserSupport();
	cameraAvailable.value = await checkCamera();
	microphoneAvailable.value = await checkMicrophone();
	moreDisplays.value = await checkDisplays();

	checkingEnd.value = true;

	if (browserSupport.value && cameraAvailable.value && microphoneAvailable.value && moreDisplays.value) {
		isAllStatus.value = false;
	} else {
		toast.error("Вы не прошли проверку");
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
			<span
				:class="{
					'bg-red-500': !browserSupport,
					'bg-green-500': browserSupport,
					'w-3 h-3 block rounded-full': true,
				}"
			>
			</span>
			Проверка браузера
		</li>
		<li class="flex gap-2 items-center">
			<span
				:class="{
					'bg-red-500': !cameraAvailable,
					'bg-green-500': cameraAvailable,
					'w-3 h-3 block rounded-full': true,
				}"
			>
			</span>
			Проверка веб-камеры
		</li>
		<li class="flex gap-2 items-center">
			<span
				:class="{
					'bg-red-500': !microphoneAvailable,
					'bg-green-500': microphoneAvailable,
					'w-3 h-3 block rounded-full': true,
				}"
			>
			</span>
			Проверка микрофона
		</li>
		<li class="flex gap-2 items-center">
			<span
				:class="{
					'bg-red-500': !moreDisplays,
					'bg-green-500': moreDisplays,
					'w-3 h-3 block rounded-full': true,
				}"
			>
			</span>
			Проверка мониторов
		</li>
		<ul v-if="checkingEnd">
			<li v-if="isAllStatus" class="text-red-500">
				<p v-if="isAllStatus" class="text-red-500">Вы не прошли проверку</p>	
			</li>
			<li v-if="!cameraAvailable" class="flex items-center gap-1">
				<span class="bg-red-500 w-3 h-3 block rounded-full"></span>
				<span class="text-red-500">Проверьте доступ для веб-камеру</span>
			</li>
			<li v-if="!microphoneAvailable" class="flex items-center gap-1">
				<span class="bg-red-500 w-3 h-3 block rounded-full"></span>
				<span class="text-red-500">Проверьте доступ для микрофона</span>
			</li>
			<li v-if="!moreDisplays" class="flex items-center gap-1">
				<span class="bg-red-500 w-3 h-3 block rounded-full"></span>
				<span class="text-red-500">Подключение более одного монитора</span>
			</li>
		</ul>
		
	</ul>
	<Button @click="changeStep" :disabled="isAllStatus"> Далее </Button>
</template>
