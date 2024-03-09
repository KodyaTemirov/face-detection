<script setup>
import { ref, watch } from 'vue';
import { Switch } from '@headlessui/vue';

const enabled = ref(false);
const emit = defineEmits(['changed']);

watch(enabled, (newVal, oldVal) => {
	emit('changed', newVal);
});
</script>

<template>
	<Switch
		v-model="enabled"
		:class="enabled ? 'bg-[#3680FA]' : 'bg-[#F9F9F9]'"
		class="relative inline-flex h-[16px] w-[29px] shrink-0 cursor-pointer rounded-full border-[1.5px] border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
	>
		<span
			aria-hidden="true"
			:class="[
				{ 'translate-x-3': enabled, 'translate-x-0': !enabled },
				{ 'bg-white': enabled, 'bg-[#8F8F8F]': !enabled },
			]"
			class="pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out"
		></span>
	</Switch>
</template>
