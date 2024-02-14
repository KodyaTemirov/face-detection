<script setup>

import { ref, computed, defineEmits } from 'vue';

const { color } = defineProps(['color']);
const emit = defineEmits();
const buttonClass = computed(() => [
	'flex', 'justify-center', 'rounded-md', 'px-3', 'py-1.5', 'text-sm', 'font-semibold', 'leading-6', 'text-white', 'shadow-sm',
	, 'focus-visible:outline', 'focus-visible:outline-2', 'focus-visible:outline-offset-2',
	`focus-visible:outline-${color}-600`,
	`bg-${color}-400`,
	`hover:bg-${color}-700`,
	'focus:outline-none',
	'focus:shadow-outline-blue',
]);


</script>

<template>
	<button @click="emit('click')" :class="buttonClass">
		<slot />
	</button>
</template>