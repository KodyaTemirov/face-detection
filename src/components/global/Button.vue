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
	<button @click="clickHandler" :disabled="disabled" class="btn">
		<slot />
	</button>
</template>

<style scoped>
.btn {
	width: 100%;
	border-radius: 200px;
	background: var(--accent-main);
	padding: 24px 48px;
	font-family: var(--font-family);
	font-weight: 500;
	font-size: 16px;
	line-height: 100%;
	color: var(--accent-button);
}
.btn:hover {
	background: var(--accent-main-hover);
}
.btn:disabled {
	opacity: 0.5;
}
</style>
