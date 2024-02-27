export const checkBrowserSupport = async () => {
	try {
		return !!(
			navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
		);
	} catch (error) {
		console.error('Ошибка при проверке браузера', error);
		return false;
	}
};

export const checkCamera = async () => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		stream.getTracks().forEach(track => track.stop());
		return true;
	} catch (error) {
		console.error('Камера не доступна', error);
		return false;
	}
};

export const checkMicrophone = async () => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		stream.getTracks().forEach(track => track.stop());
		return true;
	} catch (error) {
		console.error('Микрофон не доступен', error);
		return false;
	}
};

export const checkDisplays = async () => {
	return await fetch('http://localhost:9060/')
	.then(async response => {
		const {body: readableStream} = response;

		const reader = readableStream.getReader();

		let data = [];

		while(true){
			const {done, value} = await reader.read();

			if(done){
				break;
			}

			data.push(value);
		}

		const totalLength = data.reduce((acc, chunk) => acc + chunk.length, 0);
		const concatenedChunks = new Uint8Array(totalLength);
		let offset = 0;

		data.forEach(chunk => {
			concatenedChunks.set(chunk, offset);
			offset += chunk.length;
		})

		let concatedChunksToString = new TextDecoder().decode(concatenedChunks);
		concatedChunksToString = JSON.stringify(concatedChunksToString);

		const result = JSON.parse(concatedChunksToString);

		const arrays = result.match(/\[[^\]]*\]/g);

		const processes = arrays[0].replaceAll(/[\[\]\"]/g, '').split(', ');
		const displays = arrays[1].replaceAll(/[\[\]\"]/g, '').split(', ').slice(0, -1);

		console.log(displays, "displays");


		return displays.length == 1;

	})
	.catch(error => {
		return false;
	});
}