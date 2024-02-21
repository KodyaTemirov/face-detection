export function determineDirection(yaw, pitch, roll) {
	const YAW_THRESHOLD = 15;
	const PITCH_THRESHOLD = 15;
	const ROLL_THRESHOLD = 15;

	const currentTime = new Date();

	if (yaw < -YAW_THRESHOLD) {
		return {
			description: "O'ng tomonga qaradingiz",
			date: currentTime,
			disrupted: true,
		};
	} else if (yaw > YAW_THRESHOLD) {
		return {
			description: 'Chap tomonga qaradingiz.',
			date: currentTime,
			disrupted: true,
		};
	} else if (pitch < -PITCH_THRESHOLD) {
		return {
			description: 'Tepaga qaradingiz.',
			date: currentTime,
			disrupted: true,
		};
	} else if (pitch > PITCH_THRESHOLD) {
		return {
			description: 'Pastga qaradingiz',
			date: currentTime,
			disrupted: true,
		};
	} else if (roll < -ROLL_THRESHOLD) {
		return {
			description: 'Chap tomonga burildingiz',
			date: currentTime,
			disrupted: true,
		};
	} else if (roll > ROLL_THRESHOLD) {
		return {
			description: "O'ng tomonga burildingiz.",
			date: currentTime,
			disrupted: true,
		};
	} else {
		return {
			description: "To'g'riga qaradingiz.",
			date: currentTime,
			disrupted: false,
		};
	}
}
