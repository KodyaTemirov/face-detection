import vision from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3';
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
let faceLandmarker;
let runningMode = 'VIDEO';
let enableWebcamButton;
let webcamRunning = false;
let warningText = '';
const videoWidth = 150;
let warning = document.getElementById('warning');
let className = '';
// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function createFaceLandmarker() {
	const filesetResolver = await FilesetResolver.forVisionTasks(
		'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
	);
	faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
		baseOptions: {
			modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
			delegate: 'GPU',
		},
		outputFaceBlendshapes: true,
		outputFacialTransformationMatrixes: true,
		runningMode,
		numFaces: 10,
	});
}
createFaceLandmarker();

const video = document.getElementById('webcam');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
// Check if webcam access is supported.
function hasGetUserMedia() {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
	enableWebcamButton = document.getElementById('webcamButton');
	enableWebcamButton.addEventListener('click', enableCam);
} else {
	console.warn('getUserMedia() is not supported by your browser');
}
// Enable the live webcam view and start detection.
function enableCam(event) {
	if (!faceLandmarker) {
		console.log('Wait! faceLandmarker not loaded yet.');
		return;
	}
	if (webcamRunning === true) {
		webcamRunning = false;
		enableWebcamButton.innerText = 'ENABLE PREDICTIONS';
	} else {
		webcamRunning = true;
		enableWebcamButton.innerText = 'DISABLE PREDICTIONS';
	}
	// getUsermedia parameters.
	const constraints = {
		video: true,
	};
	// Activate the webcam stream.
	navigator.mediaDevices.getUserMedia(constraints).then(stream => {
		video.srcObject = stream;
		video.addEventListener('loadeddata', predictWebcam);
	});
}
let lastVideoTime = -1;
let results = undefined;
const drawingUtils = new DrawingUtils(canvasCtx);
async function predictWebcam() {
	const radio = video.videoHeight / video.videoWidth;
	video.style.width = videoWidth + 'px';
	video.style.height = videoWidth * radio + 'px';
	canvasElement.style.width = videoWidth + 'px';
	canvasElement.style.height = videoWidth * radio + 'px';
	canvasElement.width = video.videoWidth;
	canvasElement.height = video.videoHeight;

	let startTimeMs = performance.now();
	if (lastVideoTime !== video.currentTime) {
		lastVideoTime = video.currentTime;
		results = faceLandmarker.detectForVideo(video, startTimeMs);
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

	if (results.faceLandmarks.length == 1) {
		results.facialTransformationMatrixes.forEach((element, i) => {
			console.log(element.data[6]);
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
			console.table({ pitch: pitch, yaw: yaw, roll: roll });

			if (yaw < -15) {
				warningText = "O'ng tomonga qaradingiz.";
				className = 'alert-danger';
			} else if (yaw > 15) {
				warningText = 'Chap tomonga qaradingiz.';
				className = 'alert-danger';
			} else if (pitch < -15) {
				warningText = 'Tepaga qaradingiz.';
				className = 'alert-danger';
			} else if (pitch > 15) {
				warningText = 'Pastga qaradingiz.';
				className = 'alert-danger';
			} else if (roll < -15) {
				warningText = 'Chap tomonga burildingiz.';
				className = 'alert-danger';
			} else if (roll > 15) {
				warningText = "O'ng tomonga burildingiz.";
				className = 'alert-danger';
			} else {
				warningText = "To'g'riga qaradingiz.";
				className = 'alert-success';
			}
			console.log(warningText);
			warning.innerHTML = warningText;
			warning.classList = [];
			warning.classList.add('alert', className);
		});
	} else if (results.faceLandmarks.length >= 2) {
		warningText = `Aniqlangan odamlar: ${results.faceLandmarks.length}`;
		warning.innerHTML = warningText;
		className = 'alert-warning';
		warning.classList = '';
		warning.classList.add('alert', className);
	} else {
		warningText = 'Odam topilmadi';
		warning.innerHTML = warningText;
		className = 'alert-warning';
		warning.classList = '';
		warning.classList.add('alert', className);
	}

	if (webcamRunning === true) {
		window.requestAnimationFrame(predictWebcam);
	}
}
