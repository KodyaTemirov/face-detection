<script setup>
import { ref, onMounted, reactive } from 'vue';

import {
	FaceLandmarker,
	FilesetResolver,
	DrawingUtils,
} from '@mediapipe/tasks-vision';

const isActive = ref(true);
const canvas = ref(null);
const results = reactive({});
const blendShapes = reactive([]);
const shapes = ref(null);
const webcam = ref(null);

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
			numFaces: 1,
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

	const canvasCtx = canvas.value.getContext('2d');

	let lastVideoTime = -1;

	const drawingUtils = new DrawingUtils(canvasCtx);
	async function predictWebcam() {
		canvas.value.width = webcam.value.videoWidth;
		canvas.value.height = webcam.value.videoHeight;

		let startTimeMs = performance.now();
		if (lastVideoTime !== webcam.value.currentTime) {
			lastVideoTime = webcam.value.currentTime;
			results.value = faceLandmarker.detectForVideo(webcam.value, startTimeMs);
			try {
				blendShapes.value = results.value.faceBlendshapes[0].categories;
			} catch {
				console.log('Лицо не обнаружено');
			}
		}
		if (results.value.faceLandmarks) {
			for (const landmarks of results.value.faceLandmarks) {
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_TESSELATION,
					{ color: '#C0C0C070', lineWidth: 1 }
				);
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
					{ color: '#FF3030' }
				);
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
					{ color: '#FF3030' }
				);
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
					{ color: '#30FF30' }
				);
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
					{ color: '#30FF30' }
				);
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
					{ color: '#E0E0E0' }
				);
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_LIPS,
					{ color: '#E0E0E0' }
				);
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
					{ color: '#FF3030' }
				);
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
					{ color: '#30FF30' }
				);
			}
		}

		window.requestAnimationFrame(predictWebcam);
	}
});
</script>

<template>
	<div :class="{ invisible: isActive, video: true }" id="demos">
		<video ref="webcam" autoplay playsinline></video>
		<canvas
			ref="canvas"
			class="output_canvas"
			id="output_canvas"
			style="position: absolute; left: 0px; top: 0px"
		></canvas>
	</div>
	<ul class="blend-shapes-list" ref="shapes">
		<li v-for="shape in blendShapes.value" :key="shape.index">
			{{ shape.displayName || shape.categoryName }}:
			{{ (+shape.score).toFixed(4) }}
		</li>
	</ul>
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
