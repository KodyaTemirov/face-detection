export function determineDirection(yaw, pitch, roll) {
	const YAW_THRESHOLD = 15;
	const PITCH_THRESHOLD = 15;
	const ROLL_THRESHOLD = 15;

	if (yaw < -YAW_THRESHOLD) {
		return {
			description: "O'ng tomonga qaradingiz",
			disrupted: true,
			code: 'c2',
		};
	} else if (yaw > YAW_THRESHOLD) {
		return {
			description: 'Chap tomonga qaradingiz.',
			disrupted: true,
			code: 'c2',
		};
	} else if (pitch < -PITCH_THRESHOLD) {
		return {
			description: 'Tepaga qaradingiz.',
			disrupted: true,
			code: 'c2',
		};
	} else if (pitch > PITCH_THRESHOLD) {
		return {
			description: 'Pastga qaradingiz',
			disrupted: true,
			code: 'c2',
		};
	} else if (roll < -ROLL_THRESHOLD) {
		return {
			description: 'Chap tomonga burildingiz',
			disrupted: true,
			code: 'c2',
		};
	} else if (roll > ROLL_THRESHOLD) {
		return {
			description: "O'ng tomonga burildingiz.",
			disrupted: true,
			code: 'c2',
		};
	} else {
		return {
			description: "To'g'riga qaradingiz.",
			disrupted: false,
			code: null,
		};
	}
}
