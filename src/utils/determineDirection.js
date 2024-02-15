export function determineDirection(yaw, pitch, roll) {
	const YAW_THRESHOLD = 15;
	const PITCH_THRESHOLD = 15;
	const ROLL_THRESHOLD = 15;

	if (yaw < -YAW_THRESHOLD) {
		return "O'ng tomonga qaradingiz";
	} else if (yaw > YAW_THRESHOLD) {
		return 'Chap tomonga qaradingiz.';
	} else if (pitch < -PITCH_THRESHOLD) {
		return 'Tepaga qaradingiz.';
	} else if (pitch > PITCH_THRESHOLD) {
		return 'Pastga qaradingiz';
	} else if (roll < -ROLL_THRESHOLD) {
		return 'Chap tomonga burildingiz';
	} else if (roll > ROLL_THRESHOLD) {
		return "O'ng tomonga burildingiz.";
	} else {
		return "To'g'riga qaradingiz.";
	}
}
