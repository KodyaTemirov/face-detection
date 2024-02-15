<script setup>
const props = defineProps([
	'messages',
]);

</script>

<template>
	<div class="fixed left-0 top-0 w-80 p-4 bg-white h-svh overflow-auto">
		<h2 class="text-2xl font-bold text-blue-900 mb-8">
			Qoidabuzarliklar
		</h2>
		<ul class="flex flex-col gap-1">
			<li class="p-4 bg-sky-200 rounded-md" v-for=" message in messages">

				{{ message }}

			</li>
		</ul>
	</div>
</template >


