<script setup>
const props = defineProps(['messages']);
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock, faComment } from '@fortawesome/free-solid-svg-icons';

library.add(faClock, faComment);
import { format } from 'date-fns';
</script>

<template>
	<div class="fixed left-0 top-0 w-80 p-4 px-6 bg-white h-svh overflow-auto">
		<h2 class="text-2xl font-bold text-red-700 mb-8">
			Qoidabuzarliklar
			<span class="text-xs text-gray-600">{{ messages.length }}</span>
		</h2>
		<ul class="flex flex-col gap-1">
			<li
				class="p-4 bg-red-200 rounded-md"
				v-for="{ description, date } in messages"
			>
				<p>
					<font-awesome-icon icon="fa-solid fa-comment" />
					{{ description }}
				</p>
				<span class="text-gray-700 text-xs float-right mt-4">
					<font-awesome-icon icon="fa-solid fa-clock" />
					{{ format(date, 'HH:mm:ss') }}
				</span>
			</li>
		</ul>
	</div>
</template>
