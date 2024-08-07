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
					<img :src="(map.icon !== false) ? $path(map.icon) : $toPublic('/imgs/app/default_logo.png')" />
					<span class="text-h6 text-white text-center">{{ $capitalize(map.name) }}</span>
				</div>
			</template>
		</div>

		<!-- Dialog for init name map and minecraft version if one or all of them not exist -->
		<q-dialog v-model="dialogDef" persistent>
			<q-card style="width: 700px; max-width: 80vw;" flat>
				<q-card-section>
					<div class="text-h6">Informations</div>
				</q-card-section>
				<q-card-section class="q-pt-none">
					<q-input v-model="mapName" label="Name of project" class="q-pb-md"/>
					<q-select
						v-model="mapVersion"
						filled use-input input-debounce="0"
						style="max-height: 50px"
						label="Minecraft version"
						:options="minecraftVersions" @filter="filterVersion"
					>
						<template v-slot:no-option>
							<q-item>
								<q-item-section class="text-grey">
									{{ $q.lang.table.noResults }}
								</q-item-section>
							</q-item>
						</template>
					</q-select>
				</q-card-section>
				<q-card-actions align="right" >
					<q-btn
						v-close-popup
						icon="close"
						color="red-7"
						@click="dialogDef = false; mapVersion = ''; mapName = ''"
					/>
					<q-btn
						v-close-popup
						icon="check"
						color="teal"
						:disable="(!mapName || !mapName.length || !mapVersion || !mapVersion.length)"
						@click="dialogDefRegister"
					/>
				</q-card-actions>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { globalStore } from '@/store/global';
import { mapStore } from '@/store/map';
import router from '@/router/index';
import { minecraft } from 'mapcraft-api/frontend';
import { capitalize } from '@/app/plugins/app';

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
		let mapsInterval: NodeJS.Timer; // eslint-disable-line no-undef
		
		const mapName = ref<string>('');
		const mapVersion = ref<string>('');
		const minecraftVersions = ref<string[]>(minecraft.minecraft());
		const dialogDef = ref<boolean>(false);
		let instanceInterval: NodeJS.Timer; // eslint-disable-line no-undef

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

		const reloadSearch = (): void => getMaps(store.directory.save);
		
		// eslint-disable-next-line no-unused-vars
		const filterVersion = (val: string, update: (...args: any[]) => void) => {
			if (val === '')
				update(() => minecraftVersions.value = minecraft.minecraft());
			else {
				update(() => {
					const needle = val.toLowerCase();
					minecraftVersions.value = minecraft.minecraft().filter(v => v.toLowerCase().indexOf(needle) > -1);
				});
			}
		};

		const startInstall = () => {
			let isError = false;
			const loaderText = (text: string, val?: number) => {
				if (isError)
					return;
				$q.loading.show({
					message: `<span class="text-body1 bg-grey-3 q-pa-sm">${text}${(val !== undefined)
						? `<span class="text-yellow"> (${val.toFixed(0)}%) </span>`
						: ''}</span>`,
					html: true
				});
			};

			$q.loading.show();
			setTimeout(() => {
				window.mapcraft.engine.init(mapVersion.value as any);
				let step = 0;
				instanceInterval = setInterval(() => {
					if (step === 0) {
						if (window.mapcraft.engine.instance().instance.datapack.instanceDownload.stat.percent >= 100) {
							if (window.mapcraft.engine.instance().instance.resourcepack.instanceDownload.stat.percent > 0)
								step = 1;
							else
								loaderText(t('pages.main.install.datapack.install'));
						} else {
							loaderText(
								t('pages.main.install.datapack.download'),
								window.mapcraft.engine.instance().instance.datapack.instanceDownload.stat.percent
							);
						}
					}

					if (step === 1) {
						if (window.mapcraft.engine.instance().instance.resourcepack.instanceDownload.stat.percent >= 100) {
							if (window.mapcraft.engine.instance().instance.resourcepack.instanceExtract.stat.total > 0)
								step = 2;
							else
								loaderText(t('pages.main.install.resourcepack.default.install'));
						} else {
							loaderText(
								t('pages.main.install.resourcepack.default.download'),
								window.mapcraft.engine.instance().instance.resourcepack.instanceDownload.stat.percent
							);
						}
					}

					if (step === 2) {
						if (window.mapcraft.engine.instance().instance.resourcepack.instanceExtract.stat.total >= 100) {
							loaderText(
								t('pages.main.install.resourcepack.map.hash'),
								window.mapcraft.engine.instance().instance.resourcepack.instanceExtract.hashStat.percent
							);
						} else {
							loaderText(
								t('pages.main.install.resourcepack.map.extraction'),
								window.mapcraft.engine.instance().instance.resourcepack.instanceExtract.stat.total
							);
						}
					}
				}, 100);
				window.mapcraft.engine.install()
					.then(() => {
						clearInterval(instanceInterval as never);
						const user = $q.localStorage.getItem('user') as any;
						if (user !== null && user.remember)
							router.push('/').finally(() => $q.loading.hide());
						else
							router.push('/user').finally(() => $q.loading.hide());
					})
					.catch((err: string) => {
						const message = () => {
							if (/enotfound/i.test(err))
								return t('pages.main.error.enotfound');
							if (/not exist/i.test(err))
								return t('pages.main.error.version', { version: mapVersion.value });
							if (/resource pack/i.test(err))
								return t('pages.main.error.resourcepack', { version: mapVersion.value });
							return err
						};
						isError = true;
						$q.loading.hide();
						console.log(message());
						$q.notify({
							progress: true,
							color: 'red',
							position: 'center',
							message: capitalize(message().toString())
						});
					})
					.finally(() => {
						if ($q.loading.isActive)
							$q.loading.hide();
					});
			}, 2000);
			
		};

		const handleClick = (name: string): void => {
			if (!maps.value) {
				$q.loading.hide();
				return;
			}
			for (const el of maps.value) {
				if (el.name === name) {
					storeMap.setIcon((el.icon !== false)
						? $path(el.icon)
						: '/imgs/app/default_logo.png');
					storeMap.setPath(el.path);
					storeMap.setMapPath(window.env.directory.save, window.env.directory.resource, name);
					window.mapcraft.engine.newInstance(window.env.directory, name);
					window.mapcraft.engine.getInfo()
						.then((d: any) => {
							storeMap.setName(d.name);
							storeMap.setMinecraftVersion(d.minecraftVersion);
							mapName.value = d.name;
							mapVersion.value = d.minecraftVersion;
							startInstall();
						})
						.catch((d: any) => {
							$q.loading.hide();
							mapName.value = (d && d.name && d.name.length)
								? d.name
								: name;
							mapVersion.value = (d && d.minecraftVersion && d.minecraftVersion.length)
								? d.minecraftVersion
								: minecraft.minecraft()[minecraft.minecraft().length - 1];
							dialogDef.value = true;
						});
					return;
				}
			}
		};

		const dialogDefRegister = () => {
			if (!mapName.value.length || !mapVersion.value.length || !minecraft.minecraft().includes(mapVersion.value))
				return;
			window.mapcraft.engine.updateInfo(mapName.value, mapVersion.value)
				.then(() => {
					dialogDef.value = false;
					startInstall();
				})
				.catch((e) => console.error(e));
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
		onBeforeUnmount(() => clearInterval(mapsInterval as never));

		return {
			maps,
			mapsError,

			mapName,
			mapVersion,
			dialogDef,
			minecraftVersions,

			filterVersion,
			reloadSearch,
			handleClick,
			dialogDefRegister
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
