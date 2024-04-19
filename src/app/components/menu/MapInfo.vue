<template>
	<div class="mapInfo q-pa-sm">
		<div class="image">
			<img :src="store.info.icon"/>
		</div>
		<div class="container" @mouseover="hover = true" @mouseleave="hover = false">
			<span ref="spanChange" class="text-h5 text-center text-weight-light">
				{{ capitalize(store.info.name) }}
			</span>
			<div ref="btnChange" class="hidden">
				<q-btn
					square
					color="secondary"
					:label="$t('components.menu.mapInfo.label')"
					@click="$router.push('/map')"
				/>
			</div>
		</div>
	</div>
</template>

<script lang=ts>
import { defineComponent, onMounted, ref, watch } from 'vue';
import { mapStore } from '@/store/map';

export default defineComponent({
	name: 'MapInfo',
	setup () {
		const hover = ref<boolean>(false);
		const spanChange = ref<HTMLSpanElement | null>(null);
		const btnChange = ref<HTMLDivElement | null>(null);

		const store = mapStore();
		const capitalize = (str: string): string => str.charAt(0) + str.slice(1);

		onMounted(() => {
			watch(hover, (after) => {
				if (after) {
					spanChange.value?.classList.add('hidden');
					btnChange.value?.classList.remove('hidden');
				} else {
					spanChange.value?.classList.remove('hidden');
					btnChange.value?.classList.add('hidden');
				}
			});
		});

		return {
			hover,
			spanChange,
			btnChange,
			store,
			capitalize
		};
	}
});
</script>

<style scoped>
	.mapInfo {
		display: inline-flex;
		flex-wrap: nowrap;
		width: 100%;
		max-height: 48px;
	}
	.mapInfo .image {
		width: 25%;
		display: inherit;
		justify-content: center;
	}
	.mapInfo .container {
		width: 75%;
		display: inherit;
		justify-content: center;
		align-items: center;
	}
</style>
@/app/store/map
