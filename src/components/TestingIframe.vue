<script setup>
import { defineProps } from 'vue';

const props = defineProps(['src']);
</script>

<template>
	<div class="relative overflow-hidden h-full">
		<iframe
			class="absolute top-0 left-0 w-full h-full border-0"
			:src="src"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
		></iframe>
	</div>
</template>
