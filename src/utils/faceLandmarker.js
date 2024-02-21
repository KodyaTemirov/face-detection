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

export function rodriguesRotationVectorFromMatrix(rotationMatrix) {
	const trace = rotationMatrix[0] + rotationMatrix[4] + rotationMatrix[8];
	const angle = Math.acos((trace - 1) / 2);
	const denominator = 2 * Math.sin(angle);

	const axis = [
		rotationMatrix[5] - rotationMatrix[7],
		rotationMatrix[6] - rotationMatrix[2],
		rotationMatrix[1] - rotationMatrix[3],
	].map(component => component / denominator);

	const rotationVector = axis.map(
		component => (component * angle * 180) / Math.PI
	);

	return rotationVector;
}
