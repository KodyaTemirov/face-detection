export async function toHours(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	const formattedTime = `${hours}:${minutes}:${remainingSeconds}`;
	return formattedTime;
}
