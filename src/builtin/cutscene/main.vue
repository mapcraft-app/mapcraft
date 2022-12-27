<template>
	<q-page class="page">
		<div ref="sideNav" :class="!$q.dark.isActive ? 'main-layout-day layout-menu' : 'main-layout-night layout-menu'">
			<div class="layout-menu-button-back" :style="drawerOpen ? 'left: 250px; visibility: visible; opacity: 1' : 'left:0'" @click="openNav"></div>
			<q-btn
				class="layout-menu-button"
				color="secondary" square unelevated
				:style="drawerOpen ? 'left: 250px' : 'left: 0px'"
				:icon="drawerOpen ? 'close' : 'list'"
				@click="openNav"
			/>
			<div>
				<div class="column justify-center q-mb-md">
					<q-btn
						color="green-7" square unelevated
						style="height: 3em"
						icon="add" :title="$capitalize($t('builtin.cutscene.list.add'))"
						@click="(createCutsceneModal = true)"
					/>
				</div>
				<q-list v-if="cutsceneList.length" separator>
					<q-slide-item
						v-for="cutscene in cutsceneList"
						:key="cutscene.id" clickable
						right-color="red-7"
						:class="!$q.dark.isActive ? 'main-layout-day' : 'main-layout-night'"
						@click="openCutscene(cutscene.id)"
						@right="deleteCutscene(cutscene.id)"
					>
						<template v-slot:right>
							<q-icon name="delete"/>
						</template>
						<q-item>
							<q-item-section no-wrap>
								<span class="q-mr-md">
									<q-icon name="sell" class="q-mr-xs"/>
									{{ cutscene.name }}
								</span>
							</q-item-section>
							<q-item-section no-wrap>
								<span>
									<q-icon name="tag" class="q-mr-xs"/>
									{{ cutscene.tag }}
								</span>
							</q-item-section>
						</q-item>
					</q-slide-item>
				</q-list>
			</div>
			<q-dialog v-model="createCutsceneModal" persistent>
				<q-card style="width: 40%">
					<q-card-section class="q-pt-none">
						<q-input
							v-model="cutsceneName"
							:label="$capitalize($t('builtin.cutscene.list.addName'))"
							:rules="[val => !!val || $t('builtin.cutscene.content.table.error.noData')]"
						>
							<template v-slot:prepend>
								<q-icon name="label" />
							</template>
						</q-input>
					</q-card-section>
					<q-card-actions align="right" class="text-teal">
						<q-btn v-close-popup square color="red-7" icon="close" />
						<q-btn v-close-popup square color="green-7" icon="check" @click="createCutscene()" />
					</q-card-actions>
				</q-card>
			</q-dialog>
		</div>
		<div v-if="cutsceneSelected" class="layout-content">
			<div>
				<div class="row justify-evenly q-pt-sm q-pb-sm q-ml-xl">
					<span class="text-h6 q-mr-md">{{ cutsceneSelected.name }}</span>
					<div class="text-h6 row items-center">
						<q-icon size="sm" name="schedule"/>
						<span >{{ printTime(cutsceneSelected.duration) }}</span>
					</div>
					<div class="row no-wrap justify-between">
						<q-btn
							square unelevated color="light-blue-7"
							icon="play_arrow"
							@click="openFile(true)"
						>
							<q-tooltip :delay="500" class="bg-light-blue-7">
								{{ $capitalize($t('builtin.cutscene.content.menu.editStart')) }}
							</q-tooltip>
						</q-btn>
						<q-btn
							square unelevated color="red-7"
							icon="stop"
							@click="openFile(false)"
						>
							<q-tooltip :delay="500" class="bg-red-7">
								{{ $capitalize($t('builtin.cutscene.content.menu.editEnd')) }}
							</q-tooltip>
						</q-btn>
						<q-btn
							square unelevated color="secondary"
							icon="settings"
							@click="optionCutsceneModal = true"
						>
							<q-tooltip :delay="500" class="bg-secondary">
								{{ $capitalize($t('builtin.cutscene.content.menu.option')) }}
							</q-tooltip>
						</q-btn>
						<q-dialog v-model="optionCutsceneModal">
							<q-card style="width: 700px; max-width: 80vw;">
								<q-card-section class="row justify-between">
									<div class="text-h6">{{ $capitalize($t('builtin.cutscene.option.title')) }}</div>
									<q-btn v-close-popup icon="close" flat round dense />
								</q-card-section>
								<q-card-section class="column q-pt-none">
									<span class="text-h6 q-pt-md">{{ $capitalize($t('builtin.cutscene.option.name')) }}</span>
									<q-input v-model="cutsceneSelected.name" />
									<span class="text-h6 q-pt-md">{{ $capitalize($t('builtin.cutscene.option.description')) }}</span>
									<q-input v-model="cutsceneSelected.description" />
									<span class="text-h6 q-pt-md">{{ $capitalize($t('builtin.cutscene.option.end.title')) }}</span>
									<q-list>
										<q-item v-ripple tag="label">
											<q-item-section avatar top>
												<q-radio v-model="cutsceneEndOption" val="origin" color="teal" />
											</q-item-section>
											<q-item-section>
												<q-item-label>{{ $capitalize($t('builtin.cutscene.option.end.origin.label')) }}</q-item-label>
												<q-item-label caption>{{ $capitalize($t('builtin.cutscene.option.end.origin.desc')) }}</q-item-label>
											</q-item-section>
										</q-item>
										<q-item v-ripple tag="label">
											<q-item-section avatar top>
												<q-radio v-model="cutsceneEndOption" val="last" color="orange" />
											</q-item-section>
											<q-item-section>
												<q-item-label>{{ $capitalize($t('builtin.cutscene.option.end.last.label')) }}</q-item-label>
												<q-item-label caption>{{ $capitalize($t('builtin.cutscene.option.end.last.desc')) }}</q-item-label>
											</q-item-section>
										</q-item>
										<q-item v-ripple tag="label">
											<q-item-section avatar top>
												<q-radio v-model="cutsceneEndOption" val="custom" color="cyan" />
											</q-item-section>
											<q-item-section>
												<q-item-label>{{ $capitalize($t('builtin.cutscene.option.end.custom.label')) }}</q-item-label>
												<q-item-label caption>{{ $capitalize($t('builtin.cutscene.option.end.custom.desc')) }}</q-item-label>
												<div v-if="cutsceneEndOption === 'custom'" class="row no-wrap">
													<q-input
														v-model.number="optionsCustom.x" type="number"
														class="q-pr-xs"
														:label="$t('builtin.cutscene.content.header.x')"
													/>
													<q-input
														v-model.number="optionsCustom.y" type="number"
														class="q-pl-xs q-pr-xs"
														:label="$t('builtin.cutscene.content.header.y')"
													/>
													<q-input
														v-model.number="optionsCustom.z" type="number"
														class="q-pl-xs q-pr-xs"
														:label="$t('builtin.cutscene.content.header.z')"
													/>
													<q-input
														v-model.number="optionsCustom.rx" type="number"
														class="q-pl-xs q-pr-xs"
														:label="$t('builtin.cutscene.content.header.rx')"
													/>
													<q-input
														v-model.number="optionsCustom.ry" type="number"
														class="q-pl-xs"
														:label="$t('builtin.cutscene.content.header.ry')"
													/>
												</div>
											</q-item-section>
										</q-item>
									</q-list>
								</q-card-section>
							</q-card>
						</q-dialog>
						<q-separator vertical size="2px" class="q-ml-xs q-mr-xs"/>
						<q-btn
							square unelevated color="green-7"
							icon="save"
							@click="saveData(false)"
						>
							<q-tooltip :delay="500" class="bg-green-7">
								{{ $capitalize($t('builtin.cutscene.content.menu.save.start')) }}
							</q-tooltip>
						</q-btn>
						<q-btn
							square unelevated color="orange-7"
							icon="videocam"
							:disable="!!(cutscenePointsList && cutscenePointsList.length <= 1)"
							@click="generateCutscene()"
						>
							<q-tooltip :delay="500" class="bg-orange-7">
								{{ $capitalize($t('builtin.cutscene.content.menu.generate.start')) }}
							</q-tooltip>
						</q-btn>
					</div>
				</div>
				<div class="table table-header">
					<span class="text-h6 five"></span>
					<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.x')) }}</span>
					<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.y')) }}</span>
					<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.z')) }}</span>
					<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.rx')) }}</span>
					<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.ry')) }}</span>
					<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.duration')) }}</span>
					<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.transition')) }}</span>
				</div>
			</div>
			<template v-if="cutscenePointsList">
				<div
					v-for="point in cutscenePointsList" :key="point.point"
					class="table"
				>
					<span class="five">{{ point.point }}</span>
					<q-input v-model="point.x" type="number" dense :rules="[val => !!val || '']" />
					<q-input v-model="point.y" type="number" dense :rules="[val => !!val || '']" />
					<q-input v-model="point.z" type="number" dense :rules="[val => !!val || '']" />
					<q-input v-model="point.rx" type="number" dense :rules="[val => !!val || '']" />
					<q-input v-model="point.ry" type="number" dense :rules="[val => !!val || '']" />
					<div class="duration">
						<q-input
							v-model="point.duration" type="number"
							step="1" min="0"
							:disable="cutscenePointsList[cutscenePointsList.length - 1].point === point.point"
							:rules="[val => !!val && Number(val) >= 0 || '']" 
							dense class="q-mr-xs"
						>
							<template v-slot:append>
								<span>s</span>
							</template>
						</q-input>
					</div>
					<q-select
						v-model="point.transition"
						:disable="cutscenePointsList[cutscenePointsList.length - 1].point === point.point"
						:options="['ease', 'ease-in', 'ease-in-out', 'ease-out', 'linear']"
						dense
					/>
					<div class="seven">
						<q-btn
							square unelevated color="red-7"
							icon="delete" class="button"
							@click="removePoint(point.point)"
						/>
					</div>
				</div>
				<div class="add-point" @click="addPoint">
					<q-icon name="add" size="2em" />
				</div>
			</template>
		</div>
	</q-page>
</template>

<script lang="ts">
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useI18n } from 'vue-i18n';
import { defineComponent, onBeforeMount, onUnmounted, onMounted, ref, toRaw, watch } from 'vue';
import { mapStore } from 'store/map';
import { capitalize } from 'app/src/vue/plugins/app';

interface cutsceneInterface {
	id: number;
	name: string;
	tag: string;
	duration: number;
	description: string;
	position: string;
}

interface cutscenePointInterface {
	cutsceneId: number;
	point: number;
	x: number;
	y: number;
	z: number;
	rx: number;
	ry: number;
	duration: number;
	transition: 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear'
}

export default defineComponent({
	name: 'CutsceneBuiltin',
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();

		//#region General
		const storeMap = mapStore();
		const sideNav = ref<HTMLDivElement | null>(null);
		const drawerOpen = ref<boolean>(false);
		let saveCutscene: NodeJS.Timer; // eslint-disable-line no-undef

		const openNav = () => {
			drawerOpen.value = !drawerOpen.value;
			if (sideNav.value) {
				sideNav.value.style.left = drawerOpen.value
					? '0px'
					: '-250px';
			}
		};

		const openFile = (start: boolean) => {
			if (cutsceneSelected.value)
				window.cutscene.openFile(cutsceneSelected.value.id, start);
		};

		const saveData = (auto = true) => {
			if (cutsceneSelected.value && cutscenePointsList.value) {
				const retOptions: string[] = [cutsceneEndOption.value];
				if (cutsceneEndOption.value === 'custom') {
					retOptions.push(`x:${optionsCustom.value.x ?? ''}`);
					retOptions.push(`y:${optionsCustom.value.y ?? ''}`);
					retOptions.push(`z:${optionsCustom.value.z ?? ''}`);
					retOptions.push(`rx:${optionsCustom.value.rx ?? ''}`);
					retOptions.push(`ry:${optionsCustom.value.ry ?? ''}`);
				}
				cutsceneSelected.value.position = retOptions.join(';');
				const notif = $q.notify({
					group: false,
					timeout: 0,
					position: 'top-right',
					spinner: QSpinnerPuff,
					color: 'orange-7',
					message: auto
						? capitalize(t('builtin.cutscene.content.menu.autosave.start'))
						: capitalize(t('builtin.cutscene.content.menu.save.start'))
				});
				// eslint-disable-next-line vue/no-ref-as-operand
				window.cutscene.save(toRaw(cutsceneSelected.value), toRaw(cutscenePointsList.value))
					.then(() => {
						notif({
							color: 'green-7',
							spinner: false,
							icon: 'task_alt',
							timeout: 2500,
							message: auto
								? capitalize(t('builtin.cutscene.content.menu.autosave.end'))
								: capitalize(t('builtin.cutscene.content.menu.save.end'))
						});
					})
					.catch((e) => {
						window.log.error(e);
						if (e.code && e.code === 'SQLITE_BUSY') {
							notif({
								color: 'red-7',
								spinner: false,
								icon: 'error',
								timeout: 2500,
								message: capitalize(t('sql.busy'))
							});
						} else {
							notif({
								color: 'red-7',
								spinner: false,
								icon: 'error',
								timeout: 2500,
								message: auto
									? capitalize(t('builtin.cutscene.content.menu.autosave.fail'))
									: capitalize(t('builtin.cutscene.content.menu.save.fail'))
							});
						}
					});
			}
		};
		//#endregion General

		//#region Cutscene
		const cutsceneList = ref<cutsceneInterface[]>([]);
		const cutsceneSelected = ref<cutsceneInterface | null>(null);
		const cutscenePointsList = ref<cutscenePointInterface[] | null>(null);
		const cutsceneName = ref<string | null>(null);
		const cutsceneEndOption = ref<'origin' | 'last' | 'custom'>('origin');
		const optionsCustom = ref<cutscenePointInterface>({} as cutscenePointInterface);

		const createCutsceneModal = ref<boolean>(false);
		const optionCutsceneModal = ref<boolean>(false);
		
		const printTime = (seconds: number) => {
			const print = (x: number) => (x < 10)
				? `0${x}`
				: x;
			let hours = 0, minutes = 0;

			if (seconds >= 3600) {
				hours = Math.round(seconds / 3600);
				seconds %= 3600;
			}
			if (seconds >= 60) {
				minutes = Math.round(seconds / 60);
				seconds %= 60;
			}
			seconds = Math.round(seconds);
			return `${print(hours)}:${print(minutes)}:${print(seconds)}`;
		};

		const getCutscenes = () => {
			window.cutscene.getCutscene()
				.then((d) => {
					if (Array.isArray(d))
						cutsceneList.value = d;
					else
						cutsceneList.value.push(d);
				});
		};

		const openCutscene = async (id: number) => {
			window.mapcraft.clipboard.writeText(`cutscene_${id}`);
			const x = cutsceneList.value.findIndex((e) => e.id === id);
			cutsceneSelected.value = cutsceneList.value[x];
			if (cutsceneSelected.value.position) {
				const parse = cutsceneSelected.value.position.split(';');
				cutsceneEndOption.value = parse[0] as 'origin' | 'last' | 'custom';
				if (parse.length > 1) {
					const data = {
						x: /x:([0-9]+)/g.exec(parse[1]),
						y: /y:([0-9]+)/g.exec(parse[2]),
						z: /z:([0-9]+)/g.exec(parse[3]),
						rx: /rx:([0-9]+)/g.exec(parse[4]),
						ry: /ry:([0-9]+)/g.exec(parse[5])
					};
					if (data.x)
						optionsCustom.value.x = Number(data.x[1]);
					if (data.y)
						optionsCustom.value.y = Number(data.y[1]);
					if (data.z)
						optionsCustom.value.y = Number(data.z[1]);
					if (data.rx)
						optionsCustom.value.y = Number(data.rx[1]);
					if (data.ry)
						optionsCustom.value.y = Number(data.ry[1]);
				}
			}
			const points = await window.cutscene.getPoints(id);
			cutscenePointsList.value = points;
			points.forEach((p) => {
				if (cutsceneSelected.value)
					cutsceneSelected.value.duration += p.duration;
			});
		};

		const createCutscene = async () => {
			if (cutsceneName.value) {
				const data = await window.cutscene.create(String(cutsceneName.value));
				cutsceneList.value.push(data);
			}
		};

		const deleteCutscene = async (id: number) => {
			const x = cutsceneList.value.findIndex((e) => e.id === id);
			if (x === -1)
				return;
			cutsceneList.value.splice(x, 1);
			await window.cutscene.delete(id);
			if (cutsceneSelected.value?.id === id) {
				cutsceneSelected.value = null;
				cutscenePointsList.value = null;
			}
		};

		const generateCutscene = async () => {
			if (cutsceneSelected.value) {
				const notif = $q.notify({
					group: false,
					timeout: 0,
					position: 'top-right',
					spinner: QSpinnerPuff,
					color: 'orange-7',
					message: capitalize(t('builtin.cutscene.content.menu.generate.start'))
				});
				window.cutscene.generate(cutsceneSelected.value.id)
					.then(() => {
						notif({
							color: 'green-7',
							spinner: false,
							icon: 'task_alt',
							timeout: 2500,
							message: capitalize(t('builtin.cutscene.content.menu.generate.end'))
						});
					})
					.catch((e) =>  {
						window.log.error(e);
						if (e.code && e.code === 'SQLITE_BUSY') {
							notif({
								color: 'red-7',
								spinner: false,
								icon: 'error',
								timeout: 2500,
								message: capitalize(t('sql.busy'))
							});
						} else {
							notif({
								color: 'red-7',
								spinner: false,
								icon: 'error',
								timeout: 2500,
								message: capitalize(t('builtin.cutscene.content.menu.generate.fail'))
							});
						}
					});
			}
		};
		//#endregion Cutscene

		//#region Point
		const addPoint = () => {
			if (!cutsceneSelected.value)
				return;
			let lastPoint: cutscenePointInterface | null = null;
			if (!cutscenePointsList.value || cutscenePointsList.value.length <= 0)
				cutscenePointsList.value = [];
			else
				lastPoint = cutscenePointsList.value[cutscenePointsList.value.length - 1];
			cutscenePointsList.value.push(
				{
					cutsceneId: cutsceneSelected.value.id,
					point: (lastPoint !== null)
						? lastPoint.point + 1
						: 0,
					x: 0,
					y: 0,
					z: 0,
					rx: 0,
					ry: 0,
					duration: 0,
					transition: 'linear'
				} as cutscenePointInterface
			);
		};

		const removePoint = (pointId: number) => {
			if (!cutscenePointsList.value || !cutsceneSelected.value)
				return;
			let x = 0, duration = 0;
			let isDel = false;
			for (; x < cutscenePointsList.value.length; x++) {
				duration += cutscenePointsList.value[x].duration;
				if (!isDel && cutscenePointsList.value[x].point === pointId) {
					isDel = true;
					duration -= cutscenePointsList.value[x].duration;
					cutscenePointsList.value.splice(x, 1);
				}
				if (isDel && x < cutscenePointsList.value.length)
					--cutscenePointsList.value[x].point;
			}
			cutsceneSelected.value.duration = duration;
		};
		//#endregion Point
		
		onBeforeMount(() => {
			window.cutscene.init(storeMap.getMapPath(), storeMap.info.name)
				.then(() => getCutscenes())
				.finally(() => saveCutscene = setInterval(saveData, 300000 /* 5min */));
		});

		onMounted(() => {
			watch(cutscenePointsList, (after) => {
				if (after && cutsceneSelected.value) {
					let x = 0;
					after.forEach((e) => x += Number(e.duration));
					cutsceneSelected.value.duration = x;
				}
			}, { deep: true });
		});

		onUnmounted(() => {
			clearInterval(saveCutscene);
			saveData();
		});

		return {
			// General
			sideNav,
			drawerOpen,
			
			openNav,
			openFile,
			saveData,

			// Cutscene
			cutsceneList,
			cutsceneSelected,
			cutscenePointsList,
			cutsceneName,
			cutsceneEndOption,
			createCutsceneModal,
			optionCutsceneModal,
			optionsCustom,

			printTime,
			getCutscenes,
			openCutscene,
			createCutscene,
			deleteCutscene,
			generateCutscene,

			// Point
			addPoint,
			removePoint
		};
	}
});
</script>

<style scoped>
.layout-menu {
	width: 250px;
	position: fixed;
	top: 0;
	left: -250px;
  height: 100%;
	z-index: 10;
	overflow-x: hidden;
	transition: .3s;
}

.layout-menu-button-back {
	visibility: hidden;
	opacity: 0;
	position: fixed;
	background-color: rgba(0, 0, 0, 0.4);
	width: 100%;
	height: 100%;
	left: 250px;
	top: 0;
	transition: .3s;
}
.layout-menu-button {
	position: fixed;
	top: 0;
	left: 250px;
	width: 3em;
	height: 3em;
	transition: .3s;
}
.main-layout-day {
	background-color: #e8e8e8;
}
.main-layout-night {
	background-color: var(--q-dark);
}
.layout-content {
	position: absolute;
  width: -webkit-fill-available;
  top: 0;
  z-index: 0;
  transition: .3s;
}
.pointer {
	cursor: pointer;
}

/* Table */
.table {
	width: 100%;
	display: inline-flex;
	align-items: baseline;
	margin-bottom: .2em;
}
.table-header {
	position: sticky;
}
.table > .duration {
	display: inline-flex;
	align-items: center;
	flex-wrap: nowrap;
}
.table > .five {
	width: 5%;
}
.table > .seven {
	width: 7%;
}
.table > * {
	width: 12.57%;
	text-align: center;
	padding: 0 .5em;
	word-wrap: break-word;
}
.button {
	width: 2em;
	height: 2em;
}

.add-point {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 4em;
	border: dashed 2px;
	margin: 0.5em;
	cursor: pointer;
}
</style>
