<template>
	<div class="flex justify-center items-center flex-height">
		<template v-if="maps === null">
			<div class="card-size skeleton">
				<div class="column justify-center items-center">
					<q-spinner-cube color="secondary" size="4em" />
				</div>
			</div>
		</template>
		<template v-else>
			<div v-for="map in maps" :key="map.path" class="card-size" @click="handleClick(map.name)">
				<img :src="(map.icon !== false) ? $path(map.icon) : '/imgs/app/default_logo.png'" />
				<span class="text-h6 text-white">{{ capitalize(map.name) }}</span>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { globalStore } from 'store/global';
import { mapStore } from 'store/map';
import router from 'src/router';

interface appMapGet {
	icon: string | false;
	name: string;
	path: string;
}

export default defineComponent({
	setup () {
		const $q = useQuasar();
		const $path = inject('$path');
		const store = globalStore();
		const storeMap = mapStore();
		const maps = ref<null | appMapGet[]>(null);
		
		const getMaps = (dir: string) => {
			maps.value = null;
			window.appMap.get(dir)
				.then((data: appMapGet[]) => {
					maps.value = data;
				});
		};
		
		const handleClick = (name: string): void => {
			if (!maps.value)
				return;
			for (const el of maps.value) {
				if (el.name === name) {
					storeMap.setIcon((el.icon !== false)
						? $path(el.icon)
						: '/imgs/app/default_logo.png');
					storeMap.setName(el.name);
					storeMap.setPath(el.path);
					router.push('/user');
				}
			}
		};
		const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

		watch(store.directory, (after) => getMaps(after.save));
		onMounted(() => {
			const ret = $q.localStorage.getItem('darkMode');
			if (ret)
				$q.dark.set(Boolean(ret));
			getMaps(store.directory.save);
		});

		return {
			maps,
			handleClick,
			capitalize
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
    max-width: 200px;
		height: 200px;
    margin: 1em;
    padding: .5em;
    display: flex;
    flex-direction: column;
    align-items: center;
		justify-content: space-evenly;
		cursor: pointer;
		border-radius: 5px;
    background-color: #383737;
		transition: .3s;
	}
	.card-size > img {
		width: 75px;
		height: 75px;
	}
	.card-size:hover {
		background-color: #4a4a4a;
	}
	
	.skeleton {
		height: 200px;
	}
	.skeleton > div {
		height: inherit;
	}

</style>