<template>
	<q-page>
		<template v-if="mapsError">
			<h5 class="text-center">{{ $t(`pages.options.error.${mapsError}`) }}</h5>
			<div class="flex justify-center items-center q-pb-md">
				<q-btn round color="deep-orange" icon="restart_alt" @click="reloadSearch" />
			</div>
		</template>
		
		<div class="flex justify-center items-center">
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
	</q-page>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { globalStore } from 'store/global';
import { mapStore } from 'store/map';
import { minecraft } from 'mapcraft-api';
// import router from 'src/router';

interface appMapGet {
	icon: string | false;
	name: string;
	path: string;
}

export default defineComponent({
	setup () {
		const $q = useQuasar();
		const $path: any = inject('$path');
		const store = globalStore();
		const storeMap = mapStore();
		const maps = ref<null | appMapGet[]>(null);
		const mapsError = ref<'noMinecraft' | 'noMaps' | null>(null);
		// eslint-disable-next-line no-undef
		let mapsInterval: NodeJS.Timer;

		const getMaps = (dir: string) => {
			window.mapcraft.getMap(dir)
				.then((data) => {
					mapsError.value = null;
					if (data !== maps.value)
						maps.value = data;
				})
				.catch((e) => {
					maps.value = null;
					if (e === 'NO_MAPS')
						mapsError.value = 'noMaps';
					else
						mapsError.value = 'noMinecraft';
				});
		};
		
		const handleClick = (name: string): void => {
			if (!maps.value)
				return;
			$q.loading.show();
			for (const el of maps.value) {
				if (el.name === name) {
					storeMap.setIcon((el.icon !== false)
						? $path(el.icon)
						: '/imgs/app/default_logo.png');
					storeMap.setName(el.name);
					storeMap.setPath(el.path);
					// Init engine for map
					console.log('one');
					console.log(minecraft.minecraft());
					// window.mapcraft.engine.init(window.env.directory, name, store.minecraftVersion);
					/*window.mapcraft.engine.instance().install()
						.then(() => {
							const user = $q.localStorage.getItem('user') as any;
							if (user !== null && user.remember)
								router.push('/').finally(() => $q.loading.hide());
							else
								router.push('/user').finally(() => $q.loading.hide());
						})
						.catch((err) => {
							console.error('plip', err);
						});
					*/
				}
			}
		};
		const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
		
		onBeforeMount(() => {
			getMaps(store.directory.save);
			mapsInterval = setInterval(() => getMaps(store.directory.save), 5 * 1000);
		});
		onMounted(() => {
			const ret = $q.localStorage.getItem('darkMode');
			if (ret)
				$q.dark.set(Boolean(ret));
			watch(store.directory, (after) => getMaps(after.save));
		});
		onBeforeUnmount(() => clearInterval(mapsInterval));

		return {
			maps,
			mapsError,

			reloadSearch: (): void => getMaps(store.directory.save),
			handleClick,
			capitalize
		};
	}
});
</script>

<style scoped>
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