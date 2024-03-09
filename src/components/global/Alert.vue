<script setup>
import { defineProps } from 'vue';

const { text } = defineProps(['error']);
</script>

<template>
	<div class="alert flex gap-2">
		<Icon name="error" />
		<slot />
	</div>
</template>

<style scoped>
.alert {
	background: var(--status-error);
	font-family: var(--font-family);
	font-weight: 400;
	font-size: 12px;
	line-height: 120%;
	color: var(--accent-button);
	border-radius: 200px;
	padding: 8px;
}
</style>
