<script setup>
import { ref, onMounted, reactive, defineProps, defineEmits } from 'vue';
import Messages from '@components/Messages.vue';

import { createFaceLandmarker } from '@utils/createFaceLandmarker';
import { rodriguesRotationVectorFromMatrix, addNewMessage } from '@utils/utils';
import { determineDirection } from '@utils/determineDirection';

const props = defineProps([
	'url',
]);

const emit = defineEmits(['change-step']);

const changeStep = () => {
	emit('change-step');
};


const isActive = ref(true);
const canvas = ref(null);
const results = reactive({});
const webcam = ref(null);
const messages = ref([]);

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
			results.value = faceLandmarker.detectForVideo(webcam.value, performance.now());
		}

		const { faceLandmarks, facialTransformationMatrixes } = results.value;

		if (faceLandmarks.length === 1) {
			facialTransformationMatrixes.forEach(element => {
				const { data } = element;
				const matrix = data.slice(0, 3).concat(data.slice(4, 7)).concat(data.slice(8, 11));

				const rodriguesVector = rodriguesRotationVectorFromMatrix(matrix);

				const pitch = rodriguesVector[0];
				const yaw = rodriguesVector[1];
				const roll = rodriguesVector[2];

				messages.value = addNewMessage(messages.value, determineDirection(yaw, pitch, roll));
			});
		} else if (faceLandmarks.length >= 2) {
			messages.value = addNewMessage(messages.value, `Aniqlangan odamlar: ${faceLandmarks.length}`);
		} else {
			messages.value = addNewMessage(messages.value, 'Odam topilmadi');
		}

		window.requestAnimationFrame(predictWebcam);
	}
});

</script>

<template>
	<Messages :messages="messages" />
	<div :class="{ invisible: isActive, 'w-52 h-52 overflow-hidden rounded-full fixed right-4 bottom-4': true }" id="demos">
		<video class="clear-both block w-full h-full object-cover" ref="webcam" autoplay playsinline></video>
		<canvas ref="canvas" class="object-cover w-full h-full" id="output_canvas"
			style="position: absolute; left: 0px; top: 0px"></canvas>
	</div>
	<button @click="changeStep"
		class="bg-blue-500 py-2 px-6 rounded text-white float-right disabled:bg-slate-400 hover:bg-blue-700 my-8 ">
		Закончить
	</button>
</template>
 


