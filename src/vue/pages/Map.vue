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
					<span class="text-h6 text-white">{{ $capitalize(map.name) }}</span>
				</div>
			</template>
		</div>
		<div :class="(!mapIsSelected) ? 'custom-loader custom-loader-hide' : 'custom-loader'">
			<q-card square>
				<q-card-section class="column justify-center items-center" style="background-color: #383737">
					<q-spinner-cube
						size="6em"
						color="cyan-7"
					/>
					<span class="text-h6 text-white text-weight-light q-pt-md">{{ loaderMessage }}</span>
				</q-card-section>
			</q-card>
		</div>
		<q-btn label="click" @click="dialogDef = true"/>
		<!-- Dialog for init name map and minecraft version if one or all of them not exist -->
		<q-dialog v-model="dialogDef" persistent>
			<q-card style="width: 700px; max-width: 80vw;">
				<q-card-section>
					<div class="text-h6">Definition</div>
				</q-card-section>
				<q-card-section class="q-pt-none">
					<q-input v-model="mapName" label="Name of project" />
					<q-select
						v-model="mapVersion"
						filled use-input input-debounce="0"
						style="max-height: 50px"
						label="Simple filter" :options="minecraftVersions" @filter="filterVersion"
					>
						<template v-slot:no-option>
							<q-item>
								<q-item-section class="text-grey">
									No results
								</q-item-section>
							</q-item>
						</template>
					</q-select>
					<!--
					<q-option-group
						v-model="mapVersion"
						class="row"
						:options="minecraftVersions.map((e) => { return {'label': e, value: e } })"
						type="radio"
					/>
					-->
				</q-card-section>
				<q-card-actions align="right" class="bg-white text-teal">
					<q-btn v-close-popup flat label="OK" />
				</q-card-actions>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { globalStore } from 'store/global';
import { mapStore } from 'store/map';
import router from 'src/router';
import { minecraft } from 'mapcraft-api';

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
		const { t } = useI18n();

		const maps = ref<null | appMapGet[]>(null);
		const mapsError = ref<'noMinecraft' | 'noMaps' | null>(null);
		const mapIsSelected = ref<boolean>(false);
		const loaderMessage = ref<string>('');
		let mapsInterval: NodeJS.Timer; // eslint-disable-line no-undef

		const mapName = ref<string>('');
		const mapVersion = ref<string>('');
		const minecraftVersions = ref<string[]>(minecraft.minecraft());
		const dialogDef = ref<boolean>(false);

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
			let instanceInterval: NodeJS.Timer; // eslint-disable-line no-undef
			let step = 0;
			
			mapIsSelected.value = true;
			if (!maps.value) {
				mapIsSelected.value = false;
				return;
			}
			for (const el of maps.value) {
				if (el.name === name) {
					storeMap.setIcon((el.icon !== false)
						? $path(el.icon)
						: '/imgs/app/default_logo.png');
					storeMap.setName(el.name);
					storeMap.setPath(el.path);
					storeMap.setMapPath(window.env.directory.save, window.env.directory.resource, name);
					
					const startInstall = () => {
						instanceInterval = setInterval(() => {
							if (step === 0) {
								if (window.mapcraft.engine.instance().instance.datapack.instanceDownload.stat.percent >= 100) {
									if (window.mapcraft.engine.instance().instance.resourcepack.instanceDownload.default.stat.percent > 0)
										step = 1;
									else
										loaderMessage.value = t('pages.main.install.datapack.install');
								} else
									loaderMessage.value = t('pages.main.install.datapack.download', { percents: window.mapcraft.engine.instance().instance.datapack.instanceDownload.stat.percent});
							}

							if (step === 1) {
								if (window.mapcraft.engine.instance().instance.resourcepack.instanceDownload.default.stat.percent >= 100) {
									if (window.mapcraft.engine.instance().instance.resourcepack.instanceDownload.base.stat.percent > 0)
										step = 2;
									else
										loaderMessage.value = t('pages.main.install.resourcepack.default.install');
								} else
									loaderMessage.value = t('pages.main.install.resourcepack.default.download', { percents: window.mapcraft.engine.instance().instance.resourcepack.instanceDownload.default.stat.percent});
							}

							if (step === 2) {
								if (window.mapcraft.engine.instance().instance.resourcepack.instanceDownload.base.stat.percent >= 100) {
									step = 3;
									loaderMessage.value = t('pages.main.install.resourcepack.map.install');
								} else
									loaderMessage.value = t('pages.main.install.resourcepack.map.download', { percents: window.mapcraft.engine.instance().instance.resourcepack.instanceDownload.base.stat.percent});
							}
						}, 100);
						window.mapcraft.engine.install()
							.then(() => {
								clearInterval(instanceInterval);
								const user = $q.localStorage.getItem('user') as any;
								if (user !== null && user.remember)
									router.push('/').finally(() => $q.loading.hide());
								else
									router.push('/user').finally(() => $q.loading.hide());
							})
							.catch((err) => {
								console.error('plip', err);
							});
					};

					window.mapcraft.engine.init(window.env.directory, name, storeMap.minecraftVersion);

					window.mapcraft.engine.getInfo()
						.then(() => startInstall())
						.catch((d: any) => {
							mapName.value = d.name ?? '';
							mapVersion.value = d.version ?? '';
							dialogDef.value = true;
						});
				}
			}
		};
		
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
			mapIsSelected,
			loaderMessage,

			mapName,
			mapVersion,
			dialogDef,
			minecraftVersions,

			// eslint-disable-next-line no-unused-vars
			filterVersion: (val: string, update: (...args: any[]) => void) => {
				if (val === '')
					update(() => minecraftVersions.value = minecraft.minecraft());
				else {
					update(() => {
						const needle = val.toLowerCase();
						minecraftVersions.value = minecraft.minecraft().filter(v => v.toLowerCase().indexOf(needle) > -1);
					});
				}
			},
			reloadSearch: (): void => getMaps(store.directory.save),
			handleClick
		};
	}
});
</script>

<style scoped>
	.custom-loader-hide {
		display: none !important;
	}
	.custom-loader {
		z-index: 10000;
		position: fixed;
		background-color: rgba(210, 210, 210, .3);
		width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
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
