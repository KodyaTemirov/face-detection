<script setup>
import { computed, defineEmits, ref } from 'vue';
import { convertToEmbedLink } from '@utils/convertToEmbedLink';

const emit = defineEmits(['change-step']);

const changeStep = () => {
	emit('change-step');
};

const isChecked = ref(false);
const props = defineProps(['url']);

const urlEmbed = computed(() => {
	if (!props.url) {
		return null;
	}

	return convertToEmbedLink(props.url);
});
</script>

<template>
	<h1 class="text-2xl font-bold pb-8">Условия проведения мероприятия</h1>
	<div class="relative overflow-hidden" style="padding-top: 56.25%">
		<iframe
			class="absolute top-0 left-0 w-full h-full border-0"
			:src="urlEmbed"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
		></iframe>
	</div>

	<div class="relative flex gap-x-3">
		<div class="flex h-6 items-center">
			<input
				id="comments"
				name="comments"
				type="checkbox"
				v-model="isChecked"
				class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
			/>
		</div>
		<div class="text-sm leading-6">
			<label for="comments" class="font-medium text-gray-900"
				>Я ознакомлен(а) с правилами</label
			>
		</div>
	</div>

	<Button @click="changeStep" :disabled="!isChecked"> Далее </Button>
</template>
