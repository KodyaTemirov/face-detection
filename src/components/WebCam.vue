<script setup>
import { ref, onMounted, reactive } from 'vue';

import {
	FaceLandmarker,
	FilesetResolver,
} from '@mediapipe/tasks-vision';

const props = defineProps([
	'url',
]);

const isActive = ref(true);
const canvas = ref(null);
const results = reactive({});
const webcam = ref(null);
const messages = ref([]);

const addNewMessage = (value) => {
	const lastMessage = messages.value[messages.value.length - 1];
	if (lastMessage === value) {
		return;
	}
	messages.value = [...messages.value, value];
};

onMounted(async () => {
	let faceLandmarker;

	async function createFaceLandmarker() {
		const filesetResolver = await FilesetResolver.forVisionTasks(
			'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
		);
		faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
			baseOptions: {
				modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
				delegate: 'GPU',
			},
			runningMode: 'VIDEO',
			outputFaceBlendshapes: true,
			outputFacialTransformationMatrixes: true,
			numFaces: 10,
		});
		isActive.value = false;
	}

	await createFaceLandmarker();
	navigator.mediaDevices
		.getUserMedia({
			video: true,
		})
		.then(stream => {
			webcam.value.srcObject = stream;
			webcam.value.addEventListener('loadeddata', predictWebcam);
		});


	let lastVideoTime = -1;

	async function predictWebcam() {
		canvas.value.width = webcam.value.videoWidth;
		canvas.value.height = webcam.value.videoHeight;


		let startTimeMs = performance.now();
		if (lastVideoTime !== webcam.value.currentTime) {
			lastVideoTime = webcam.value.currentTime;
			results.value = faceLandmarker.detectForVideo(webcam.value, startTimeMs);
		}

		// Rodrigues
		function rodriguesRotationVectorFromMatrix(rotationMatrix) {
			const trace = rotationMatrix[0] + rotationMatrix[4] + rotationMatrix[8];

			let angle = Math.acos((trace - 1) / 2);

			let axis = [
				rotationMatrix[5] - rotationMatrix[7],
				rotationMatrix[6] - rotationMatrix[2],
				rotationMatrix[1] - rotationMatrix[3],
			];
			const denominator = 2 * Math.sin(angle);
			axis = axis.map(component => component / denominator);

			const rotationVector = axis.map(
				component => (component * angle * 180) / Math.PI
			);

			return rotationVector;
		}

		if (results.value.faceLandmarks.length == 1) {
			results.value.facialTransformationMatrixes.forEach((element) => {
				const matrix = [
					element.data[0],
					element.data[1],
					element.data[2],
					element.data[4],
					element.data[5],
					element.data[6],
					element.data[8],
					element.data[9],
					element.data[10],
				];
				const rodriguesVector = rodriguesRotationVectorFromMatrix(matrix);

				let pitch = rodriguesVector[0];
				let yaw = rodriguesVector[1];
				let roll = rodriguesVector[2];

				if (yaw < -15) {
					addNewMessage(`O'ng tomonga qaradingiz`);
				} else if (yaw > 15) {
					addNewMessage(`Chap tomonga qaradingiz.`);
				} else if (pitch < -15) {
					addNewMessage(`Tepaga qaradingiz.`);
				} else if (pitch > 15) {
					addNewMessage(`Pastga qaradingiz`);
				} else if (roll < -15) {
					addNewMessage(`Chap tomonga burildingiz`);
				} else if (roll > 15) {
					addNewMessage(`O'ng tomonga burildingiz.`);
				} else {
					addNewMessage(`To'g'riga qaradingiz.`);
				}
			});
		} else if (results.value.faceLandmarks.length >= 2) {
			addNewMessage(`Aniqlangan odamlar: ${results.value.faceLandmarks.length}`);
		} else {
			addNewMessage(`Odam topilmadi`);
		}

		window.requestAnimationFrame(predictWebcam);

	}
});
</script>

<template>
	<ul class="fixed left-0 top-0 w-80 p-8 bg-white h-svh overflow-auto">
		<li class="py-4" v-for="message in messages">{{ message }}</li>

	</ul>
	<div :class="{ invisible: isActive, 'w-52 h-52 overflow-hidden rounded-full fixed right-4 bottom-4': true }" id="demos">
		<video class="clear-both block w-full h-full object-cover" ref="webcam" autoplay playsinline></video>
		<canvas ref="canvas" class="object-cover w-full h-full" id="output_canvas"
			style="position: absolute; left: 0px; top: 0px"></canvas>
	</div>
	<div class="responsive-iframe-container">
		<iframe class="responsive-iframe" :src="props.url" frameborder="0" allowfullscreen></iframe>
	</div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}

.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
