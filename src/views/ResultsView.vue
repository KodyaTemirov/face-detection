<script setup>
import { ref, onMounted } from 'vue';
import { useResultStore } from '@stores/ResultStore';
import { toHours } from '@utils/formatSeconds';
const resultStore = useResultStore();
const time = ref(null);
const { score, status, info, description } = resultStore.result;

const formatTime = async () => {
	time.value = await toHours(info.duration);
};

onMounted(async () => {
	await formatTime();
});
</script>

<template>
	<h1 class="text-2xl font-bold pb-8">Результаты</h1>

	<p
		v-if="status === 'PASSED'"
		class="text-green-500 text-2xl flex flex-col justify-center items-center gap-8 font-bold"
	>
		<span class="text-9xl"> 🥳</span>
		Поздравляем, вы прошли тестирование!
	</p>
	<p
		v-else
		class="text-red-500 text-2xl flex flex-col justify-center items-center gap-8 font-bold"
	>
		<span class="text-9xl"> 😔</span>
		К сожалению, вы провалил тестирование
	</p>

	<h3 class="text-xl my-4 text-center font-bold">
		Уровень доверия: {{ score }}
	</h3>
	<p class="text-center text-gray-500">Длительность: {{ time }}</p>
	<p class="text-xl font-bold my-8">Статистика по нарушениям:</p>
	<ul class="flex flex-col gap-2">
		<li class="bg-white" v-for="item in description" :key="value">
			<span class="flex justify-between">
				<span class="p-4">{{ item.value }}</span>
				<span class="p-4">{{ item.count }}</span></span
			>
		</li>
	</ul>
</template>
