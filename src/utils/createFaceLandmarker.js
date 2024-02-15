import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

export async function createFaceLandmarker() {
	const filesetResolver = await FilesetResolver.forVisionTasks(
		'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
	);
	return FaceLandmarker.createFromOptions(filesetResolver, {
		baseOptions: {
			modelAssetPath:
				'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
			delegate: 'GPU',
		},
		runningMode: 'VIDEO',
		outputFaceBlendshapes: true,
		outputFacialTransformationMatrixes: true,
		numFaces: 10,
	});
}
