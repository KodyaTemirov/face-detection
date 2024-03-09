<script setup>
import { ref, onMounted, defineProps, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const apiUrl = import.meta.env.VITE_API_URL;

import TestingView from '@views/TestingView.vue';
import CheckingView from '@views/CheckingView.vue';
import RulesView from '@views/RulesView.vue';
import CapturePicView from '@views/CapturePicView.vue';
import LoadingView from '@views/LoadingView.vue';
import ResultsView from '@views/ResultsView.vue';

import { useSocketStore } from '@stores/SocketStore';
const socketStore = useSocketStore();

const { user_id, session_id } = defineProps(['user_id', 'session_id']);

const isLoading = ref(true);
const isError = ref(false);
const errorMessage = ref(null);
const userInfo = ref({ test: 'test' });
const router = useRouter();
const step = ref(1);

const changeStep = () => {
	if (step.value < 5) {
		step.value += 1;
	}
};

const fetchData = async () => {
	try {
		if (user_id.length === 36 && session_id.length === 36) {
			const response = await axios.get(
				apiUrl +
					`/services/platon-core/api/get_user?token=${user_id}&session_id=${session_id}`
			);
			const data = response.data;

			if (!data || !data.data) {
				throw new Error('Invalid response format');
			}

			const { user, check } = data.data;

			userInfo.value = user;

			if (!check.user_exists && !check.session_exists) {
				router.push('/not-found');
			}

			isLoading.value = false;
		} else {
			errorMessage.value = 'Неправильная ссылка';
			isLoading.value = false;
			isError.value = true;
		}
	} catch (error) {
		errorMessage.value = error.response.data.message;
		isLoading.value = false;
		isError.value = true;
	}
};

onMounted(() => {
	fetchData();
	socketStore.initWebSocket('ws://localhost:9061');
});
</script>

<template>
	<Layout v-if="!(step === 4)">
		<div v-if="isLoading">
			<LoadingView />
		</div>
		<div v-if="isError">
			{{ errorMessage }}
		</div>

		<CheckingView
			v-if="!isLoading && userInfo && step === 1"
			@change-step="changeStep"
		/>

		<RulesView
			v-if="step === 2"
			:url="userInfo.video_url"
			@change-step="changeStep"
		/>
		<CapturePicView
			:id="user_id"
			:session_id="session_id"
			v-if="step === 3"
			@change-step="changeStep"
		/>
	</Layout>
	<TestingView
		v-if="step === 4"
		:url="userInfo.iframe_url"
		@change-step="changeStep"
	/>
	<ResultsView v-if="step === 5" @change-step="changeStep" />
</template>
