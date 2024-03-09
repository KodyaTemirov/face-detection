<script setup>
import { defineProps } from 'vue';
const { icon, status } = defineProps(['icon', 'status']);
const emit = defineEmits(['click']);

import softUrls from '../helpers/softUrls';
</script>
<template>
	<ul class="flex gap-2 flex-col justify-center mt-6">
		<li class="item" v-for="{ name, url, icon } in softUrls">
			<div class="status">
				<Icon :name="icon" :class="{ active: status, error: !status }" />
			</div>
			<a class="item-text" :href="url">{{ name }}</a>
		</li>
	</ul>
</template>

<style scoped>
.error {
	fill: var(--status-error);
}
.active {
	fill: var(--status-succes);
}
.item {
	display: flex;
	gap: 8px;
	border-radius: 200px;
	padding: 4px;
	background: var(--basic-light-lighgrey);
}
.status {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 200px;
	padding: 4px;
	width: 24px;
	height: 24px;
	background: var(--accent-button);
}
.item-text {
	font-family: var(--font-family);
	font-weight: 500;
	font-size: 14px;
	align-items: center;
	display: flex;

	line-height: 100%;
	color: var(--basic-light-black);
}
</style>
