export const takePhoto = async (webcam, videoWidth, videoHeight) => {
	const canvas = document.createElement('canvas');
	canvas.width = videoWidth;
	canvas.height = videoHeight;
	const context = canvas.getContext('2d');
	context.drawImage(webcam.value, 0, 0, videoWidth * 1.3, videoHeight);
	const photoDataUrl = canvas.toDataURL('image/png');

	return photoDataUrl;
};
