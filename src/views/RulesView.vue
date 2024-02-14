<script setup>
import { onMounted, ref } from 'vue';


const props = defineProps([
	'url',
]);

const urlEmbed = ref(null);

function convertToEmbedLink(youtubeLink) {
	// Проверяем, является ли переданная ссылка корректной ссылкой YouTube
	const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)/;
	if (!youtubeRegex.test(youtubeLink)) {
		console.error('Некорректная ссылка YouTube');
		return null;
	}

	// Извлекаем идентификатор видео из ссылки
	const videoId = youtubeLink.match(/[a-zA-Z0-9_-]{11}/)[0];

	// Формируем embed-ссылку
	const embedLink = `https://www.youtube.com/embed/${videoId}`;
	urlEmbed.value = embedLink;
}
onMounted(async () => {
	await convertToEmbedLink(props.url);
});

</script>

<template>
	<h1 class="text-2xl font-bold pb-8">Условия проведения мероприятия</h1>
	<div class="responsive-iframe-container">
		<!-- <iframe class="responsive-iframe" :src="urlEmbed" title="YouTube video player" frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen></iframe> -->
	</div>
</template>
<style>
/* Стили для резинового iframe */
.responsive-iframe-container {
	position: relative;
	overflow: hidden;
	padding-top: 56.25%;
	/* Высота в процентах (16:9 соотношение сторон) */
}

.responsive-iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: 0;
}
</style>