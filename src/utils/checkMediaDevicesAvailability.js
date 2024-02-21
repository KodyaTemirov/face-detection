export async function isCameraEnabled() {
	return new Promise(resolve => {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			resolve(false);
		}

		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then(stream => {
				stream.getTracks().forEach(track => track.stop());
				resolve(true);
			})
			.catch(() => {
				resolve(false);
			});
	});
}
