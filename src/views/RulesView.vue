<script setup>
import { computed, defineEmits, defineProps, ref } from 'vue';
import { convertToEmbedLink } from '@utils/convertToEmbedLink';
import Switch from '@components/Switch.vue';

const emit = defineEmits(['change-step']);

const changeStep = () => {
	emit('change-step');
};

const isChecked = ref(false);
const props = defineProps(['url']);

const changeCheck = e => {
	isChecked.value = e;
};

const urlEmbed = computed(() => {
	if (!props.url) {
		return null;
	}

	return convertToEmbedLink(props.url);
});
</script>

<template>
	<Card :title="$t('stage[1].condition')" class="w-full top__card">
		<div
			class="relative overflow-hidden rounded-xl mt-4"
			style="padding-top: 56.25%"
		>
			<iframe
				class="absolute top-0 left-0 w-full h-full border-0"
				:src="urlEmbed"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	</Card>
	<Card class="mt-4 w-full card__allow">
		<div class="relative flex gap-x-3 items-center">
			<Switch id="allowSwitch" @changed="changeCheck"></Switch>
			<div class="text-sm leading-6">
				<label
					for="allowSwitch"
					class="font-medium cursor-pointer select-none text-gray-900"
					>{{ $t('stage[1].rulesAllow') }}</label
				>
			</div>
		</div>
	</Card>

	<div class="w-full">
		<Button
			@click="changeStep"
			:disabled="!isChecked"
			class="mt-2 w-full next_btn"
		>
			Далее
		</Button>
	</div>
</template>

<style scoped>
@media only screen and (max-width: 1300px) {
	/* LAPTOP */

	.top__card {
		margin-top: 30%;
	}

	.card__allow {
		padding: 30px 20px 30px 20px;
	}

	.next_btn {
		margin-bottom: 5%;
	}
}
</style>
