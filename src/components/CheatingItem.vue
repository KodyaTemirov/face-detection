<script setup>
import { defineProps } from 'vue';

const props = defineProps(['title', 'count']);
</script>

<template>
	<div class="error__item">
		<Icon class="error__item-icon flex-none" name="error-circle"></Icon>
		<div class="error__item__right">
			<p class="error__item__right-title">
				{{ props.title }}
			</p>
			<p class="error__item__right-subtitle" v-if="props.count">
				{{ props.count }} раза
			</p>
		</div>
	</div>
</template>

<style scoped>
.error__item {
	padding: 14px 12px;
	border-radius: 10px;
	display: flex;
	gap: 4px;
	background: #f9f9f9;
}

.error__item-icon {
	width: 26px;
	height: 26px;
	object-fit: contain;
}

.error__item__right {
	display: flex;
	flex-direction: column;
	gap: 6px;
	max-width: 160px;
}

.error__item__right-title {
	font-size: 14px;
	font-weight: 500;
	line-height: 14px;
	letter-spacing: 0em;
	text-align: left;
	color: #f43834;
	margin: 0;
}

.error__item__right-subtitle {
	font-size: 12px;
	font-weight: 400;
	line-height: 14px;
	letter-spacing: 0em;
	text-align: left;
	color: #0d0d0d;
	margin: 0;
}
</style>
