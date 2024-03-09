<script setup>
import {
	ref,
	onMounted,
	reactive,
	defineProps,
	defineEmits,
	onBeforeUnmount,
	watch,
} from 'vue';
import TestingIframe from '@components/TestingIframe.vue';
import Stat from '@components/Stat.vue';
import CheatingItem from '@components/CheatingItem.vue';

import {
	checkCamera,
	checkMicrophone,
	checkingResizeWindow,
} from '@utils/checkDevice';
import { takePhoto } from '@utils/takePhoto';
import { domainFromUrl } from '@utils/domainFromUrl';

import { useToast, POSITION } from 'vue-toastification';
import {
	useFaceDetectionStore,
	useCheatingStore,
	useVoiceDetectorStore,
	useResultStore,
	useSocketStore,
} from '@stores';

import {
	createFaceLandmarker,
	rodriguesRotationVectorFromMatrix,
} from '@utils/faceLandmarker';
import { determineDirection } from '@utils/determineDirection';

const props = defineProps(['url']);
const toast = useToast();
const emit = defineEmits(['change-step']);

const voiceDetectorStore = useVoiceDetectorStore();
const faceDetectionStore = useFaceDetectionStore();
const cheatingStore = useCheatingStore();
const resultStore = useResultStore();
const socketStore = useSocketStore();

const cameraAvailable = ref(true);
const microphoneAvailable = ref(true);
const isActive = ref(true);
const canvas = ref(null);
const results = reactive({});
const webcam = ref(null);
const messages = ref([]);
const isDisrupted = ref(false);
const detectInterval = ref(false);

const fullScreenElement = ref(null);
const fullScreenState = ref(false);

const detectFullscreen = function () {
	if (fullScreenElement.value.requestFullscreen) {
		fullScreenElement.value
			.requestFullscreen()
			.then(() => {
				document.addEventListener('contextmenu', function (event) {
					event.preventDefault();
				});

				if (!fullScreenState.value) {
					document.addEventListener('fullscreenchange', checkFullScreen);
				} else {
					fullScreenState.value = false;
					document.removeEventListener('fullscreenchange', checkFullScreen);
				}
			})
			.catch(err => {
				alert(
					`Ошибка при попытке включить полноэкранный режим: ${err.message} (${err.name})`
				);
			});
	} else if (fullScreenElement.value.mozRequestFullScreen) {
		/* Firefox */
		fullScreenElement.value
			.mozRequestFullScreen()
			.then(() => {
				document.addEventListener('contextmenu', function (event) {
					event.preventDefault();
				});

				if (!fullScreenState.value) {
					document.addEventListener('fullscreenchange', checkFullScreen);
				} else {
					fullScreenState.value = false;
					document.removeEventListener('fullscreenchange', checkFullScreen);
				}
			})
			.catch(err => {
				alert(
					`Ошибка при попытке включить полноэкранный режим: ${err.message} (${err.name})`
				);
			});
	} else if (fullScreenElement.value.webkitRequestFullscreen) {
		/* Chrome, Safari & Opera */
		fullScreenElement.value
			.webkitRequestFullscreen()
			.then(() => {
				document.addEventListener('contextmenu', function (event) {
					event.preventDefault();
				});

				if (!fullScreenState.value) {
					document.addEventListener('fullscreenchange', checkFullScreen);
				} else {
					fullScreenState.value = false;
					document.removeEventListener('fullscreenchange', checkFullScreen);
				}
			})
			.catch(err => {
				alert(
					`Ошибка при попытке включить полноэкранный режим: ${err.message} (${err.name})`
				);
			});
	} else if (fullScreenElement.value.msRequestFullscreen) {
		/* IE/Edge */
		fullScreenElement.value
			.msRequestFullscreen()
			.then(() => {
				document.addEventListener('contextmenu', function (event) {
					event.preventDefault();
				});

				if (!fullScreenState.value) {
					document.addEventListener('fullscreenchange', checkFullScreen);
				} else {
					fullScreenState.value = false;
					document.removeEventListener('fullscreenchange', checkFullScreen);
				}
			})
			.catch(err => {
				alert(
					`Ошибка при попытке включить полноэкранный режим: ${err.message} (${err.name})`
				);
			});
	}
};

let checkFullScreen = () => {
	if (fullScreenState.value) {
		cheatingStore.addCheating('b3', faceDetectionStore.attempt_id);
	}
	fullScreenState.value = !fullScreenState.value;
};

const changeFocus = () => {
	if (document.hidden) {
		cheatingStore.addCheating('b1', faceDetectionStore.attempt_id);

		toast.error('Iltimos, imtihon oynasida qoling.', {
			timeout: 4000,
			position: POSITION.BOTTOM_CENTER,
		});
	}
};
const checkingOpenNewTab = () => {
	document.addEventListener('visibilitychange', changeFocus);
};

const addNewMessage = (messages, value) => {
	if (value.disrupted) {
		isDisrupted.value = true;
	} else {
		isDisrupted.value = false;
	}

	const lastMessage = messages[messages.length - 1];

	if (value.disrupted && lastMessage?.description !== value.description) {
		cheatingStore.addCheating(value.code, faceDetectionStore.attempt_id);
		return [...messages, value];
	} else {
		return [...messages];
	}
};

const finishHandler = async () => {
	await resultStore.finishHandler(faceDetectionStore.attempt_id);
};
const startIntervalDetect = () => {
	detectInterval.value = setInterval(async () => {
		cameraAvailable.value = checkCamera();
		microphoneAvailable.value = checkMicrophone();

		if (!isDisrupted.value) {
			const photoData = await takePhoto(webcam, 218, 218);

			await faceDetectionStore.faceUpdate(
				photoData,
				faceDetectionStore.attempt_id
			);
		} else {
			toast.error(`To'g'riga qarang!`, {
				timeout: 4000,
				position: POSITION.BOTTOM_CENTER,
			});
		}
	}, 5000);
};
const stopIntervalDetect = () => {
	clearInterval(detectInterval.value);
};
// TODO: нужно пофиксить
// watch(
// 	() => voiceDetectorStore.voiceDetected,
// 	(newVal, oldVal) => {
// 		// if (newVal) {
// 		// 	cheatingStore.addCheating('m2', faceDetectionStore.attempt_id);
// 		// }
// 	}
// );

watch(
	() => socketStore.isOnlyMonitor,
	(newVal, oldVal) => {
		if (!newVal) {
			cheatingStore.addCheating('s2', faceDetectionStore.attempt_id);
			toast.error('Ikkinchi monitor ulandi!', {
				timeout: 4000,
				position: POSITION.BOTTOM_CENTER,
			});
		}
	}
);

onMounted(async () => {
	window.addEventListener('message', handleMessage);
	function handleMessage(event) {
		const url = domainFromUrl(props.url);

		// Проверка на безопасность, чтобы принимать сообщения только от ожидаемого источника
		if (event.origin !== url) {
			return;
		}

		const { testIsFinish } = event.data;

		// Проверяем, что полученное событие - событие от кнопки в iframe
		if (testIsFinish) {
			finishHandler();
		}
	}

	// detectFullscreen();
	let faceLandmarker;

	const setupFaceLandmarker = async () => {
		faceLandmarker = await createFaceLandmarker();
		isActive.value = false;
	};

	await checkingOpenNewTab(faceDetectionStore.attempt_id);
	checkingResizeWindow();
	await setupFaceLandmarker();
	await voiceDetectorStore.createAudioClassifier();
	await voiceDetectorStore.runStreamingAudioClassification();

	let lastVideoTime = -1;

	const predictWebcam = () => {
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
				code: 'c4',
			});
		} else {
			messages.value = addNewMessage(messages.value, {
				description: 'Odam topilmadi',
				disrupted: true,
				code: 'c3',
			});
		}

		window.requestAnimationFrame(predictWebcam);
	};

	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		webcam.value.srcObject = stream;
		webcam.value.addEventListener('loadeddata', predictWebcam);
	} catch (error) {
		console.error('Error accessing webcam:', error);
	}
	startIntervalDetect();
});
onBeforeUnmount(() => {
	document.removeEventListener('visibilitychange', changeFocus);
	stopIntervalDetect();
});
</script>

<template>
	<div class="px-10 py-12 flex gap-5 box-border h-svh">
		<Card class="w-full"> <TestingIframe :src="url" /> </Card>
		<div class="right-panel w-64 flex-none flex flex-col gap-4 h-full">
			<div class="flex flex-col justify-between h-full">
				<div class="flex flex-col gap-2">
					<Card>
						<h4 class="titleCard">Уровень доверия:</h4>
						<Stat :value="cheatingStore.currentScore"></Stat>
					</Card>
					<Card
						class="flex gap-2 flex-col max-h-[220px] overflow-y-scroll"
						v-if="cheatingStore.allCheating"
					>
						<CheatingItem
							v-for="{ title, count } in cheatingStore.allCheating"
							:title="title"
							:count="count"
						/>
					</Card>
				</div>
				<div
					class="h-[224px]"
					v-if="cameraAvailable && microphoneAvailable"
					ref="fullScreenElement"
				>
					<div
						:class="{
							invisible: isActive,
							'border-green-800': !isDisrupted,
							'border-red-500': isDisrupted,
							'w-52 h-52 overflow-hidden rounded-full border-8 border-solid relative mx-auto': true,
						}"
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
					<div class="timer">
						<Icon name="clock" />
						00:30
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.titleCard {
	font-family: var(--font-family);
	font-weight: 500;
	font-size: 20px;
	line-height: 110%;
	letter-spacing: -0.02em;
	color: var(--basic-light-black);
}
.timer {
	position: relative;
	z-index: 2;
	margin: -30px auto;
	background: var(--accent-main);
	border-radius: 12px;
	padding: 16px 32px;
	width: 120px;
	display: flex;
	font-family: var(--font-family);
	font-weight: 500;
	gap: 4px;
	font-size: 14px;
	line-height: 100%;
	color: var(--accent-button);
}
</style>
