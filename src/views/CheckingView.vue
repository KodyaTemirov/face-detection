<script setup>
import { ref, onMounted, defineEmits, watch } from 'vue';
import SoftUrls from '@components/SoftUrls.vue';

import {
	checkBrowserSupport,
	checkCamera,
	checkMicrophone,
} from '@utils/checkDevice';
const emit = defineEmits(['change-step']);
const changeStep = () => {
	emit('change-step');
};

import { useSocketStore } from '@stores';
import Alert from '../components/global/Alert.vue';

const socketStore = useSocketStore();
const browserSupport = ref(false);
const cameraAvailable = ref(false);
const microphoneAvailable = ref(false);
const isAllStatus = ref(true);

const checkingEnd = ref(false);

onMounted(async () => {
	browserSupport.value = await checkBrowserSupport();
	cameraAvailable.value = await checkCamera();
	microphoneAvailable.value = await checkMicrophone();
	checkingEnd.value = true;

	if (
		browserSupport.value &&
		cameraAvailable.value &&
		microphoneAvailable.value &&
		socketStore.socketIsRun &&
		socketStore.isOnlyMonitor
	) {
		isAllStatus.value = false;
	} else {
		isAllStatus.value = true;
	}
});

// Добавим watch для отслеживания изменений в socketIsRun
watch(
	() => socketStore.socketIsRun,
	(newVal, oldVal) => {
		if (newVal) {
			isAllStatus.value = false;
		} else {
			isAllStatus.value = true;
		}
	}
);
watch(
	() => socketStore.isOnlyMonitor,
	(newVal, oldVal) => {
		if (
			newVal &&
			browserSupport.value &&
			cameraAvailable.value &&
			microphoneAvailable.value
		) {
			isAllStatus.value = false;
		} else {
			isAllStatus.value = true;
		}
	}
);
</script>

<template>
	<Card :title="$t('stage[0].title')">
		<p class="description">
			{{ $t('stage[0].description') }}
		</p>

		<ul class="my-8 flex flex-col gap-2">
			<CheckedItem icon="browser" :status="browserSupport">
				{{ $t('stage[0].checkedBrowser') }}
			</CheckedItem>
			<CheckedItem icon="camera" :status="cameraAvailable">
				{{ $t('stage[0].checkedCam') }}
			</CheckedItem>
			<CheckedItem icon="microphone" :status="microphoneAvailable">
				{{ $t('stage[0].checkedMic') }}
			</CheckedItem>
			<CheckedItem icon="monitor" :status="socketStore.isOnlyMonitor">
				{{ $t('stage[0].checkedMonitor') }}
			</CheckedItem>
		</ul>

		<div class="flex gap-2 flex-col" v-if="checkingEnd">
			<Alert error v-if="!browserSupport">
				{{ $t('stage[0].notBrowser') }}
			</Alert>
			<Alert error v-if="!cameraAvailable"> {{ $t('stage[0].notCam') }} </Alert>
			<Alert error v-if="!microphoneAvailable"
				>{{ $t('stage[0].notMic') }}
			</Alert>
			<Alert error v-if="!socketStore.isOnlyMonitor"
				>{{ $t('stage[0].notMon') }}
			</Alert>
		</div>
	</Card>
	<Card
		title="Вы не прошли проверку"
		class="mt-7 w-full"
		v-if="!socketStore.socketIsRun"
	>
		<p class="description">
			Пожалуйста, запустите программу, чтобы проверить ваше устройство.
		</p>
		<SoftUrls />
	</Card>

	<Button @click="changeStep" :disabled="isAllStatus" class="mt-2">
		{{ $t('global.next') }}</Button
	>
</template>

<style scoped>
.description {
	font-family: var(--font-family);
	font-weight: 400;
	font-size: 14px;
	line-height: 125%;
	text-align: center;
	color: var(--basic-light-darkgrey);
}
</style>
