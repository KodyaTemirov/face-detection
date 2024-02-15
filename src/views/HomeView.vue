<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

import TestingView from '@views/TestingView.vue';
import CheckingView from '@views/CheckingView.vue';
import RulesView from '@views/RulesView.vue';
import CapturePicView from '@views/CapturePicView.vue';

import LoadingView from '@views/LoadingView.vue';

const { id } = defineProps(['id']);
const isLoading = ref(true);
const userInfo = ref({
	'test': 'test'
});
const router = useRouter();

const step = ref(1);
const changeStep = () => {
	step.value = step.value + 1;
};

const fetchData = async () => {
	try {
		const { data } = await axios.get(
			'https://proctoring.platon.uz/services/platon-core/api/get_user?token=' + id,
		);
		userInfo.value = data.data.user;

		const resData = data.data;
		console.log(userInfo.value);
		if (!resData.check) {
			router.push('/not-found');
		}

		isLoading.value = false;

	} catch (error) {
		console.log(error);
	}
};



onMounted(fetchData);

</script>

<template>
	<div v-if="isLoading">
		<LoadingView />
	</div>
	<div v-else-if="!isLoading && userInfo">
		<div class="text-gray-400 mb-8"> <span>Шаг {{ step }} </span></div>
		<div v-if="step === 1">
			<RulesView :url="userInfo.video_url" />
		</div>
		<div v-else-if="step === 2">
			<CheckingView />
		</div>
		<div v-else-if="step === 3">
			<CapturePicView />
		</div>
		<div v-else-if="step === 4">
			<TestingView :url="userInfo.iframe_url" />
		</div>
		<button @click="changeStep"
			class="bg-blue-500 py-2 px-6 rounded text-white float-right disabled:bg-slate-400 hover:bg-blue-700 my-8 ">
			Далее
		</button>
	</div>
</template>
