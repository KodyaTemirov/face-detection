import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToast, POSITION } from 'vue-toastification';
import audio from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0';

const { AudioClassifier, AudioClassifierResult, FilesetResolver } = audio;
const toast = useToast();

export const useVoiceDetectorStore = defineStore(
	'useVoiceDetectorStore',
	() => {
		const voiceDetected = ref(false);
		const audioClassifier = ref(null);
		const audioCtx = ref(null);

		const createAudioClassifier = async function () {
			const audio = await FilesetResolver.forAudioTasks(
				'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0/wasm'
			);
			audioClassifier.value = await AudioClassifier.createFromOptions(audio, {
				baseOptions: {
					modelAssetPath:
						'https://storage.googleapis.com/mediapipe-models/audio_classifier/yamnet/float32/1/yamnet.tflite',
				},
			});
		};

		const runStreamingAudioClassification = async function () {
			const constraints = { audio: true };
			let stream;
			try {
				stream = await navigator.mediaDevices.getUserMedia(constraints);
			} catch (err) {
				console.log('The following error occured: ' + err);
				alert('getUserMedia not supported on your browser');
			}
			if (!audioCtx.value) {
				audioCtx.value = new AudioContext({ sampleRate: 16000 });
			} else if (audioCtx.value.state === 'running') {
				await audioCtx.value.suspend();
				console.log('START CLASSIFYING');
				return;
			}
			// resumes AudioContext if has been suspended
			await audioCtx.value.resume();
			console.log('STOP CLASSIFYING');
			const source = audioCtx.value.createMediaStreamSource(stream);
			const scriptNode = audioCtx.value.createScriptProcessor(16384, 1, 1);
			scriptNode.onaudioprocess = function (audioProcessingEvent) {
				const inputBuffer = audioProcessingEvent.inputBuffer;
				let inputData = inputBuffer.getChannelData(0);
				// Classify the audio
				const result = audioClassifier.value.classify(inputData);
				const categories = result[0].classifications[0].categories;
				// Display results

				const speechCategory = categories.find(
					category => category.categoryName === 'Speech'
				);

				if (speechCategory) {
					voiceDetected.value = speechCategory.score > 0.05;
				}
			};
			source.connect(scriptNode);
			scriptNode.connect(audioCtx.value.destination);
		};

		return {
			voiceDetected,
			createAudioClassifier,
			runStreamingAudioClassification,
		};
	}
);
