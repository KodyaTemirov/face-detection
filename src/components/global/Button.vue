<script setup>
import { defineProps } from 'vue';

// Определение props
const props = defineProps(['disabled']);
const emit = defineEmits(['click']);

const clickHandler = () => {
	emit('click');
};
</script>

<template>
	<button
		@click="clickHandler"
		:disabled="disabled"
		class="bg-blue-500 py-2 px-6 rounded text-white float-right disabled:bg-slate-400 hover:bg-blue-700 my-8"
	>
		<slot />
	</button>
</template>
