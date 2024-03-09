export function convertToEmbedLink(youtubeLink) {
	const youtubeRegex =
		/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)/;
	if (!youtubeRegex.test(youtubeLink)) {
		console.error('Некорректная ссылка YouTube');
		return null;
	}

	const videoId = youtubeLink.match(/[a-zA-Z0-9_-]{11}/)[0];
	return `https://www.youtube.com/embed/${videoId}`;
}
