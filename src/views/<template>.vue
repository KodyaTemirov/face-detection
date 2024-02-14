<template>
	<div>
		<input placeholder="fullname" v-model="fullname" />
		<input type="file" @change="onFileChange" />
		<button @click="sendPostRequest">Submit</button>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const file = ref(null);
const fullname = ref(null);

const generateUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

const onFileChange = (event) => {
	file.value = event.target.files[0];
};

const sendPostRequest = async () => {
	const uniq_id = generateUUID();
	let formData = new FormData();
	formData.append('file', file.value);

	try {
		const uploadResponse = await fetch(
			'https://proctoring.platon.uz/services/platon-core/web/v1/public/files/upload/category/passport_image',
			{
				method: 'POST',
				body: formData,
			}
		);

		if (!uploadResponse.ok) {
			throw new Error('File upload failed');
		}

		const uploadData = await uploadResponse.json();

		const obj = {
			uniq_id: uniq_id,
			photo_id: uploadData.id,
			full_name: fullname.value,
		};

		const userDataResponse = await fetch(
			'https://proctoring.platon.uz/services/platon-core/api/user_data',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(obj),
			}
		);

		if (!userDataResponse.ok) {
			throw new Error('User data submission failed');
		}

		const userData = await userDataResponse.json();

		console.log('Response:', userData);
	} catch (error) {
		console.error('Error:', error);
	}
};
</script>

<style></style>