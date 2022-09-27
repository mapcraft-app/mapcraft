<template>
	<div class="row no-wrap justify-around q-pa-md">
		<img :src="linkToAvatar" @error="defaultImgError" />
		<div class="column justify-center q-pl-sm">
			<span class="text-h5 text-center text-weight-light q-pb-sm">
				{{ userPseudo }}
			</span>
			<q-btn outline square :label="$t('components.menu.profile.change')" />
		</div>
	</div>
	<div class="row justify-center q-pb-sm">
		<q-btn square flat :label="$t('components.menu.profile.documentation')" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import defaultImgError from 'vue/lib/defaultImgError';

export default defineComponent({
	setup() {
		return {
			linkToAvatar: '/imgs/icon/none.png',
			userPseudo: 'Vex345',
			defaultImgError
		};
	}
});
</script>
