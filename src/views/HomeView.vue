<template>
	<div>
		<div v-if="isLoading">
			<LoadingView />
		</div>
		<div v-else-if="!isLoading && userInfo">
			<div class="text-gray-400 mb-8">
				<span>Шаг {{ step }} </span>
			</div>
			<RulesView
				v-if="step === 1"
				:url="userInfo.video_url"
				@change-step="changeStep"
			/>
			<CheckingView v-if="step === 2" @change-step="changeStep" />
			<CapturePicView
				:id="user_id"
				:session_id="session_id"
				v-if="step === 3"
				@change-step="changeStep"
			/>
			<TestingView
				v-if="step === 4"
				:url="userInfo.iframe_url"
				@change-step="changeStep"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const apiUrl = import.meta.env.VITE_API_URL;

import TestingView from '@views/TestingView.vue';
import CheckingView from '@views/CheckingView.vue';
import RulesView from '@views/RulesView.vue';
import CapturePicView from '@views/CapturePicView.vue';
import LoadingView from '@views/LoadingView.vue';

const { user_id, session_id } = defineProps(['user_id', 'session_id']);
const isLoading = ref(true);
const userInfo = ref({ test: 'test' });
const router = useRouter();
const step = ref(1);

const changeStep = () => {
	if (step.value < 4) {
		step.value += 1;
	}
};

const fetchData = async () => {
	try {
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

		if (!check) {
			router.push('/not-found');
		}

		isLoading.value = false;
	} catch (error) {
		console.error(error);
	}
};

onMounted(fetchData);
</script>
