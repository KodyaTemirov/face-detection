<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import RecordRTC from 'recordrtc';

const recorder = ref(null);
const videoStream = ref(null);
const audioStream = ref(null);
const recording = ref(false);
const videoPlayer = ref(null);
const audioPlayer = ref(null);

const startRecording = () => {
	navigator.mediaDevices
		.getDisplayMedia({ video: true })
		.then((videoStream) => {
			navigator.mediaDevices.getUserMedia({ audio: true })
				.then((audioStream) => {
					const combinedStream = new MediaStream([...videoStream.getTracks(), ...audioStream.getTracks()]);
					recorder.value = new RecordRTC(combinedStream, {
						type: 'video',
					});

					recorder.value.startRecording();
					recording.value = true;
				})
				.catch((error) => console.error('Ошибка при получении аудиопотока:', error));
		})
		.catch((error) => console.error('Ошибка при получении видеопотока:', error));
};

const stopRecording = () => {
	if (recorder.value) {
		recorder.value.stopRecording(() => {
			const videoBlob = recorder.value.getBlob();
			const videoUrl = URL.createObjectURL(videoBlob);
			videoPlayer.value.src = videoUrl;

			const audioBlob = recorder.value.getBlob();
			const audioUrl = URL.createObjectURL(audioBlob);
			audioPlayer.value.src = audioUrl;
		});

		if (videoStream.value) {
			videoStream.value.getTracks().forEach((track) => track.stop());
		}
		if (audioStream.value) {
			audioStream.value.getTracks().forEach((track) => track.stop());
		}

		recording.value = false;
	}
};

const toggleRecording = () => {
	if (recording.value) {
		stopRecording();
	} else {
		startRecording();
	}
};

onMounted(() => {
	// Начать запись при монтировании компонента
	startRecording();
});

onUnmounted(() => {
	// Остановить запись при размонтировании компонента
	stopRecording();
});

const props = defineProps([
	'url',
]);

const isActive = ref(true);
const canvas = ref(null);
const results = reactive({});
const blendShapes = reactive([]);
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
	const predictWebcam = async () => {
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
	};
});
</script>
 
<template>
	<h1 class="text-2xl font-bold pb-8">Тестирование</h1>
	<button @click="toggleRecording">{{ recording ? 'Остановить запись' : 'Начать запись' }}</button>

	<video ref="videoPlayer" controls></video>

	<div class="responsive-iframe-container">
		<iframe class="responsive-iframe" :src="props.url" frameborder="0" allowfullscreen></iframe>
	</div>

	<div :class="{ invisible: isActive, 'w-52 h-52 overflow-hidden rounded-full fixed right-4 bottom-4': true }" id="demos">
		<video class="clear-both block w-full h-full object-cover" ref="webcam" autoplay playsinline></video>
		<canvas ref="canvas" class="object-cover w-full h-full" id="output_canvas"
			style="position: absolute; left: 0px; top: 0px"></canvas>
	</div>
	<!-- <ul class="flex flex-col " ref="shapes">
			<li v-for="shape in blendShapes.value" :key="shape.index">
				{{ shape.displayName || shape.categoryName }}:
				{{ (+shape.score).toFixed(4) }}
			</li>
		</ul> -->
</template>
 
 
