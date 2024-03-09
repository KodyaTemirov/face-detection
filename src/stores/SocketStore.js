import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSocketStore = defineStore('socketStore', () => {
	const socket = ref(null);
	const socketIsRun = ref(null);
	const isOnlyMonitor = ref(false);

	// Инициализация WebSocket соединения
	const initWebSocket = url => {
		socket.value = new WebSocket(url);

		// Обработка события открытия соединения
		socket.value.onopen = () => {
			socketIsRun.value = true;
		};

		// Обработка события получения сообщения
		socket.value.onmessage = event => {
			const data = JSON.parse(event.data);
			if (data.count === 1) {
				isOnlyMonitor.value = true;
			} else {
				isOnlyMonitor.value = false;
			}
		};

		// Обработка события закрытия соединения
		socket.value.onclose = () => {
			socketIsRun.value = false;
		};
	};

	// Закрытие WebSocket соединения
	const closeWebSocket = () => {
		if (socket.value) {
			socketIsRun.value = false;
			socket.value.close();
		}
	};

	return {
		socket,
		isOnlyMonitor,
		socketIsRun,
		initWebSocket,
		closeWebSocket,
	};
});
