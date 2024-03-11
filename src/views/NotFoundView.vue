<script setup></script>

<template>
	<div class="flex flex-col gap-3">
		<router-link
		to="/start?user_id=5424a4b0-1b38-4fb5-a3c2-9f8e8fcf8b0d&session_id=f2401ab8-5ec3-4604-9eed-c6cc8587ebd2"
	>
		Qodirjon
	</router-link>
		<router-link
			to="/start?user_id=550e8400-e29b-41d4-a716-446655440000&session_id=f2401ab8-5ec3-4604-9eed-c6cc8587ebd2"
		>
			Xurshid
		</router-link>
		<router-link
			to="/start?user_id=87d5806c-ef4b-43bb-bf8d-c270f5f35f35&session_id=f2401ab8-5ec3-4604-9eed-c6cc8587ebd2"
		>
			Haydar aka
		</router-link>
	</div>
	
	<div class="text-center">
		<p class="text-base font-semibold text-indigo-600">404</p>
		<h1
			class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl"
		>
			Page not found
		</h1>
		<p class="mt-6 text-base leading-7 text-gray-600">
			Sorry, we couldn’t find the page you’re looking for.
		</p>
		<div class="mt-10 flex items-center justify-center gap-x-6">
			<a
				href="#"
				class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>Go back home</a
			>
			<a href="#" class="text-sm font-semibold text-gray-900"
				>Contact support <span aria-hidden="true">&rarr;</span></a
			>
		</div>
	</div>
</template>