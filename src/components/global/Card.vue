<script setup>
import { defineProps, defineEmits } from 'vue';

const { title } = defineProps(['title']);
const emit = defineEmits(['click']);
</script>

<template>
	<div class="card">
		<h2 v-if="title" class="title mb-7">{{ title }}</h2>
		<slot />
	</div>
</template>
<style scoped>
.card {
	border-radius: 20px;
	padding: 30px 20px 40px 20px;
	background: var(--accent-button);
}
.title {
	font-family: var(--font-family);
	font-weight: 500;
	font-size: 20px;
	line-height: 110%;
	letter-spacing: -0.02em;
	text-align: center;
	color: var(--basic-light-black);
}
</style>
