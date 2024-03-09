<template>
	<main>
		<div class="layout">
			<slot />
		</div>
	</main>
</template>

<script setup></script>
<style>
.layout {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	width: 808px;
	padding: 20px;
	height: 100vh;
}
</style>
