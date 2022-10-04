<template>
	<div id="test"></div>
	<div class="flex justify-center items-center flex-height">
		<template v-if="maps === null">
			<q-card class="card-size skeleton">
				<div class="column justify-center items-center">
					<q-spinner-cube color="secondary" size="4em" />
				</div>
			</q-card>
		</template>
		<template v-else>
			<q-card v-for="map in maps" :key="map.path" class="card-size">
				<q-img :src="map.icon">
					<span class="absolute-bottom text-h6">{{ map.name }}</span>
				</q-img>
			</q-card>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { globalStore } from 'store/global';

interface appMapGet {
	icon: string;
	name: string;
	path: string;
}

export default defineComponent({
	setup () {
		const $q = useQuasar();
		const store = globalStore();
		const maps = ref<null | appMapGet[]>(null);
		
		const getMaps = (dir: string) => {
			maps.value = null;
			window.appMap.get(dir)
				.then((data: appMapGet[]) => {
					maps.value = data;
				});
		};
		
		watch(store.directory, (after) => getMaps(after.save));
		onMounted(() => getMaps(store.directory.save));

		return {
			maps
		};
	}
});
</script>

<style scoped>
	.flex-height {
		height: 100%;
	}
	.card-size {
		width: 100%;
		max-width: 250px;
		margin: 1em 1em;
	}
	.skeleton {
		height: 250px;
	}
	.skeleton > div {
		height: inherit;
	}
</style>