<template>
	<div class="row no-wrap justify-between q-pa-md">
		<img :src="linkToAvatar" @error="defaultImgError" />
		<div class="column justify-center">
			<span class="text-h5 text-center text-weight-light q-pb-sm">{{ userPseudo }}</span>
			<q-btn
				outline
				square
				label="change user"
			/>
		</div>
	</div>
	<div class="row justify-center q-pb-sm">
		<q-btn
			square
			flat
			label="documentation"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import defaultImgError from 'vue/lib/defaultImgError';

export default defineComponent({
	setup () {
		return {
			linkToAvatar: '/src/assets/imgs/icon/none.png',
			userPseudo: 'Vex345',
			defaultImgError
		};
	}
});
</script>
