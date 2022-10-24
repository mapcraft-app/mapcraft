<template>
	<div class="width-form">
		<q-btn unlevated color="green-8" :label="$t('pages.user.mapcraft')" @click="mapcraft"/>
	</div>
	<q-separator vertical size="1px" color="grey-4" />
	<div class="width-form">
		<template v-if="isServerMode">
			<span class="text-center">{{ $t('pages.user.offlineServer') }}</span>
		</template>
		<template v-else>
			<q-btn
				unelevated
				color="orange-8"
				:disable="isServerMode"
				:label="$t('pages.user.offline')"
				style="width: -webkit-fill-available"
				@click="isOffline"
			/>
		</template>
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
			mapcraft: (): void => emit('mapcraftAccountSelected'),
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
</style>
