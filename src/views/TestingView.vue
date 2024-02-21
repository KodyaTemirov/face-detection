<script setup>
import { ref, onMounted, reactive, defineProps, defineEmits } from 'vue';
import Messages from '@components/Messages.vue';
import { checkCamera, checkMicrophone } from '@utils/checkDevice';

import {
	createFaceLandmarker,
	rodriguesRotationVectorFromMatrix,
} from '@utils/faceLandmarker';
import { determineDirection } from '@utils/determineDirection';

const props = defineProps(['url']);

const emit = defineEmits(['change-step']);

const changeStep = () => {
	emit('change-step');
};

const cameraAvailable = ref(true);
const microphoneAvailable = ref(true);

const isActive = ref(true);
const canvas = ref(null);
const results = reactive({});
const webcam = ref(null);
const messages = ref([]);
const isDisrupted = ref(false);

const addNewMessage = (messages, value) => {
	if (value.disrupted) {
		isDisrupted.value = true;
	} else {
		isDisrupted.value = false;
	}

	const lastMessage = messages[messages.length - 1];

	if (value.disrupted && lastMessage?.description !== value.description) {
		return [...messages, value];
	} else {
		return [...messages];
	}
};

onMounted(async () => {
	let faceLandmarker;

	async function setupFaceLandmarker() {
		faceLandmarker = await createFaceLandmarker();
		isActive.value = false;
	}

	await setupFaceLandmarker();

	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		webcam.value.srcObject = stream;
		webcam.value.addEventListener('loadeddata', predictWebcam);
	} catch (error) {
		console.error('Error accessing webcam:', error);
	}
	let lastVideoTime = -1;

	function predictWebcam() {
		canvas.value.width = webcam.value.videoWidth;
		canvas.value.height = webcam.value.videoHeight;

		if (lastVideoTime !== webcam.value.currentTime) {
			lastVideoTime = webcam.value.currentTime;
			results.value = faceLandmarker.detectForVideo(
				webcam.value,
				performance.now()
			);
		}

		const { faceLandmarks, facialTransformationMatrixes } = results.value;

		if (faceLandmarks.length === 1) {
			facialTransformationMatrixes.forEach(element => {
				const { data } = element;
				const matrix = data
					.slice(0, 3)
					.concat(data.slice(4, 7))
					.concat(data.slice(8, 11));
				const rodriguesVector = rodriguesRotationVectorFromMatrix(matrix);

				const pitch = rodriguesVector[0];
				const yaw = rodriguesVector[1];
				const roll = rodriguesVector[2];

				messages.value = addNewMessage(
					messages.value,
					determineDirection(yaw, pitch, roll)
				);
			});
		} else if (faceLandmarks.length >= 2) {
			messages.value = addNewMessage(messages.value, {
				description: `Aniqlangan odamlar: ${faceLandmarks.length}`,
				disrupted: true,
				date: new Date(),
			});
		} else {
			messages.value = addNewMessage(messages.value, {
				description: 'Odam topilmadi',
				disrupted: true,
				date: new Date(),
			});
		}

		window.requestAnimationFrame(predictWebcam);
	}
	setInterval(async () => {
		cameraAvailable.value = checkCamera();
		microphoneAvailable.value = checkMicrophone();
	}, 5000);
});
</script>

<template>
	<div v-if="cameraAvailable && microphoneAvailable">
		<Messages :messages="messages" />
		<div class="relative overflow-hidden" style="padding-top: 56.25%">
			<iframe
				class="absolute top-0 left-0 w-full h-full border-0"
				:src="url"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>

		<div
			:class="{
				invisible: isActive,
				'border-green-800': !isDisrupted,
				'border-red-500': isDisrupted,
				'w-52 h-52 overflow-hidden rounded-full fixed right-4 bottom-4  border-8 border-solid': true,
			}"
			id="demos"
		>
			<video
				class="clear-both block w-full h-full object-cover"
				ref="webcam"
				autoplay
				playsinline
			></video>
			<canvas
				ref="canvas"
				class="object-cover w-full h-full"
				id="output_canvas"
				style="position: absolute; left: 0px; top: 0px"
			></canvas>
		</div>
		<button
			@click="changeStep"
			class="bg-blue-500 py-2 px-6 rounded text-white float-right disabled:bg-slate-400 hover:bg-blue-700 my-8"
		>
			Закончить
		</button>
	</div>
	<div v-else class="text-red-500">
		Вы нарушили правила. Из за недоступности камер либо микрофона вы
		заблокированы.
	</div>
</template>
