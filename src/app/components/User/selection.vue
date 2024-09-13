<template>
	<div class="flex column">
		<div class="width-form q-mb-md">
			<q-btn
				disable
				color="green-8"
				:label="$t('pages.user.mapcraft')"
				@click="mapcraft"
			/>
		</div>
		<div class="width-form">
			<template v-if="isServerMode">
				<span class="text-center">{{ $t('pages.user.offlineServer') }}</span>
			</template>
			<template v-else>
				<q-btn
					color="orange-8"
					class="button-offline"
					:disable="isServerMode"
					:label="$t('pages.user.offline')"
					@click="isOffline"
				/>
			</template>
		</div>
	</div>
</template>

<script lang=ts>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ComponentUserSelection',
	props: {
		isServerMode: Boolean
	},
	emits: ['isOffline', 'mapcraftAccountSelected'],
	setup (_props, { emit }) {
		return {
			mapcraft: (): void => {
				// emit('mapcraftAccountSelected');
			},
			isOffline: (): void => emit('isOffline')
		};
	}
});
</script>

<style scoped>
.width-form {
	display: inline-flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
	padding: 0 .4em;
}
.button-offline {
	width: -webkit-fill-available;
}
</style>
