import { useToast, POSITION } from 'vue-toastification';

const toast = useToast();

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

export const checkingResizeWindow = () => {
	window.addEventListener('resize', () => {
		toast.error(`Iltimos, ekran o'lchamini o'zgartirmaslikka harakat qiling`, {
			timeout: 4000,
			position: POSITION.BOTTOM_CENTER,
		});
	});
};
