<template>
	<sidenav-component
		:list="cutsceneList"
		@created="createCutscene"
		@deleted="deleteCutscene"
		@selected="selectCutscene"
	/>
	<div v-if="cutsceneSelected" class="layout-content">
		<options
			:model-value="cutsceneSelected"
			@open="openFile"
			@save="saveData"
			@generate="generateCutscene()"
		/>
		<template v-if="cutsceneSelected">
			<point-component
				v-for="point of cutsceneSelected.points"
				:key="point.point"
				:model-value="point"
				:disable="cutsceneSelected.points[cutsceneSelected.points.length - 1].point === point.point"
				@delete="removePoint"
			/>
			<div class="add-point" @click="addPoint()">
				<q-icon name="add" size="2em" />
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useI18n } from 'vue-i18n';
import { defineComponent, onBeforeMount, onUnmounted, onMounted, ref, toRaw, watch } from 'vue';
import { mapStore } from 'store/map';
import { capitalize } from 'app/src/vue/plugins/app';
import { cutscene, cutsceneInterface, cutscenePointInterface, end } from './interface';
import shell from './shell';
import type { ipcCommand } from 'electron/api/shell/interface';

import Options from './components/option.vue';
import PointComponent from './components/point.vue';
import SidenavComponent from './components/sidenav.vue';

export default defineComponent({
	name: 'CutsceneBuiltin',
	components: {
		Options,
		PointComponent,
		SidenavComponent
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const storeMap = mapStore();
		const cutsceneList = ref<cutsceneInterface[]>([]);
		const cutsceneSelected = ref<cutscene | null>(null);
		let saveCutscene: NodeJS.Timer; // eslint-disable-line no-undef

		const openFile = (start: boolean) => {
			if (cutsceneSelected.value)
				window.cutscene.openFile(cutsceneSelected.value.cutscene.id, start);
		};

		//#region Cutscene
		const getCutscenes = () => {
			window.cutscene.getCutscene()
				.then((d) => {
					if (Array.isArray(d))
						cutsceneList.value = d;
					else
						cutsceneList.value.push(d);
				});
		};

		const createCutscene = async (name: string) => {
			const data = await window.cutscene.create(name);
			cutsceneList.value.push(data);
		};

		const deleteCutscene = async (id: number) => {
			const x = cutsceneList.value.findIndex((e) => e.id === id);
			if (x === -1)
				return;
			cutsceneList.value.splice(x, 1);
			await window.cutscene.delete(id);
			if (cutsceneSelected.value?.cutscene.id === id)
				cutsceneSelected.value = null;
		};

		const selectCutscene = async (index: number) => {
			cutsceneSelected.value = {
				cutscene: {} as cutsceneInterface,
				points: [] as cutscenePointInterface[],
				option: {
					end: 'last',
					point: {} as cutscenePointInterface
				}
			} as cutscene;
			cutsceneSelected.value.cutscene = cutsceneList.value[index];
			if (cutsceneList.value[index].position) {
				const parse = cutsceneList.value[index].position.split(';');
				cutsceneSelected.value.option.end = parse[0] as end;
				if (parse.length > 1) {
					const reg = /^[a-z]{1,2}:(.*)$/m;
					const data = {
						x: reg.exec(parse[1]),
						y: reg.exec(parse[2]),
						z: reg.exec(parse[3]),
						rx: reg.exec(parse[4]),
						ry: reg.exec(parse[5])
					};
					if (data.x)
						cutsceneSelected.value.option.point.x = Number(data.x[1]);
					if (data.y)
						cutsceneSelected.value.option.point.y = Number(data.y[1]);
					if (data.z)
						cutsceneSelected.value.option.point.z = Number(data.z[1]);
					if (data.rx)
						cutsceneSelected.value.option.point.rx = Number(data.rx[1]);
					if (data.ry)
						cutsceneSelected.value.option.point.ry = Number(data.ry[1]);
				}
				const points = await window.cutscene.getPoints(cutsceneList.value[index].id);
				cutsceneSelected.value.points = points;
				points.forEach((p) => {
					if (cutsceneSelected.value)
						cutsceneSelected.value.cutscene.duration += p.duration;
				});
			}
		};

		const generateCutscene = async () => {
			if (!cutsceneSelected.value)
				return;
			const notif = $q.notify({
				group: false,
				timeout: 0,
				position: 'top-right',
				spinner: QSpinnerPuff,
				color: 'orange-7',
				message: capitalize(t('builtin.cutscene.content.menu.generate.start'))
			});
			window.cutscene.generate(cutsceneSelected.value.cutscene.id)
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
		};
		//#endregion Cutscene

		//#region Point
		const addPoint = (data?: { point: number[], rotation: number[] }) => {
			if (!cutsceneSelected.value)
				return;
			let lastPoint: cutscenePointInterface | null = null;
			if (!cutsceneSelected.value.points || cutsceneSelected.value.points.length <= 0)
				cutsceneSelected.value.points = [];
			else
				lastPoint = cutsceneSelected.value.points[cutsceneSelected.value.points.length - 1];
			cutsceneSelected.value.points.push({
				cutsceneId: cutsceneSelected.value.cutscene.id,
				point: (lastPoint !== null)
					? lastPoint.point + 1
					: 0,
				x: (data)
					? data.point[0]
					: '0',
				y: (data)
					? data.point[1]
					: '0',
				z: (data)
					? data.point[2]
					: '0',
				rx: (data)
					? data.rotation[0]
					: '0',
				ry: (data)
					? data.rotation[1]
					: '0',
				duration: 0,
				transition: 'linear'
			} as cutscenePointInterface);
		};

		const removePoint = (pointId: number) => {
			if (!cutsceneSelected.value)
				return;
			let x = 0, duration = 0;
			let isDel = false;
			for (; x < cutsceneSelected.value.points.length; x++) {
				duration += cutsceneSelected.value.points[x].duration;
				if (!isDel && cutsceneSelected.value.points[x].point === pointId) {
					isDel = true;
					duration -= cutsceneSelected.value.points[x].duration;
					cutsceneSelected.value.points.splice(x, 1);
				}
				if (isDel && x < cutsceneSelected.value.points.length)
					--cutsceneSelected.value.points[x].point;
			}
			cutsceneSelected.value.cutscene.duration = duration;
		};
		//#endregion Point

		//#region Save
		const saveData = (auto = true) => {
			if (!cutsceneSelected.value || !cutsceneSelected.value.points)
				return;
			const retOptions: string[] = [ cutsceneSelected.value.option.end ];
			if (cutsceneSelected.value.option.end === 'custom') {
				retOptions.push(`x:${cutsceneSelected.value.option.point.x ?? ''}`);
				retOptions.push(`y:${cutsceneSelected.value.option.point.y ?? ''}`);
				retOptions.push(`z:${cutsceneSelected.value.option.point.z ?? ''}`);
				retOptions.push(`rx:${cutsceneSelected.value.option.point.rx ?? ''}`);
				retOptions.push(`ry:${cutsceneSelected.value.option.point.ry ?? ''}`);
			}
			cutsceneSelected.value.cutscene.position = retOptions.join(';');

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
			window.cutscene.save(
				toRaw(cutsceneSelected.value.cutscene),
				toRaw(cutsceneSelected.value.points)
			)
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
		};
		//#endregion Save

		const shellCommand  = (command: ipcCommand) => {
			if (command.ret.command === shell.name
				&& command.ret.data
				&& cutsceneSelected.value) {
				if (command.ret.data.type === 'add-point')
					addPoint(command.ret.data.coordinates);
				else if (command.ret.data.type === 'delete-point') {
					console.log('delete');
					console.log(command.ret.data);
				}
			}
		};

		onBeforeMount(() => {
			window.cutscene.init(storeMap.getMapPath(), storeMap.info.name)
				.then(() => getCutscenes())
				.finally(() => saveCutscene = setInterval(saveData, 300000 /* 5min */));
		});

		onMounted(() => {
			window.ipc.receiveAll('shell::command', shellCommand);
			watch(cutsceneSelected, (val) => {
				if (val && cutsceneSelected.value) {
					let x = 0;
					val.points.forEach((e) => x += Number(e.duration));
					cutsceneSelected.value.cutscene.duration = x;
				}
			}, { deep: true });
		});

		onUnmounted(() => {
			window.ipc.remove('shell::command', shellCommand);
			clearInterval(saveCutscene);
			saveData();
		});

		return {
			cutsceneList,
			cutsceneSelected,

			openFile,
			getCutscenes,
			createCutscene,
			deleteCutscene,
			selectCutscene,
			generateCutscene,

			addPoint,
			removePoint,

			saveData
		};
	}
});
</script>

<style scoped>
.layout-content {
	position: absolute;
  width: -webkit-fill-available;
  top: 0;
  z-index: 0;
  transition: .3s;
	margin: 0 .7em;
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
.add-point:hover {
	color: rgb(19, 157, 95);
}
</style>
