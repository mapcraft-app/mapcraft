<template>
	<q-page style="height: calc(100vh - 79px);">
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
				<div class="column justify-center q-mt-md q-mb-md">
					<q-btn
						color="green-7" square unelevated
						icon="add" title="Create new cutscene"
						@click="(createCutsceneModal = true)"
					/>
					<!--<q-btn @click="(editorOpen = !editorOpen)" label="toto" />-->
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
						<q-input v-model="cutsceneName" label="Name of new cutscene">
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
				<div class="row justify-evenly q-pt-sm q-pb-sm">
					<span class="text-h6">{{ cutsceneSelected.name }}</span>
					<div class="text-h6 row items-center">
						<q-icon size="sm" name="schedule"/>
						<span >{{ printTime(cutsceneSelected.duration) }}</span>
					</div>
					<div>
						<q-btn
							square unelevated color="light-blue-7"
							icon="play_arrow" class="q-mr-sm"
							@click="openFile(true)"
						/>
						<q-btn
							square unelevated color="orange-7"
							icon="stop" class="q-mr-sm"
							@click="openFile(false)"
						/>
						<q-btn
							square unelevated color="green-7"
							icon="settings"
							@click="generateCutscene()"
						/>
					</div>
				</div>
				<q-separator />
				<div class="table table-header">
					<span class="text-h6 five"></span>
					<span class="text-h6">X</span>
					<span class="text-h6">Y</span>
					<span class="text-h6">Z</span>
					<span class="text-h6">Rx</span>
					<span class="text-h6">Ry</span>
					<span class="text-h6">Duration</span>
					<span class="text-h6">Transition</span>
				</div>
			</div>
			
			<div
				v-for="point in cutscenePointsList" :key="point.point"
				class="table"
			>
				<span class="five">{{ point.point }}</span>
				<q-input v-model="point.x" type="number" dense />
				<q-input v-model="point.y" type="number" dense />
				<q-input v-model="point.z" type="number" dense />
				<q-input v-model="point.rx" type="number" dense />
				<q-input v-model="point.ry" type="number" dense />
				<div class="duration">
					<q-input
						v-model="point.duration" type="number"
						step="1" min="0"
						dense class="q-mr-xs"
					/>
					<span>s</span>
				</div>
				<q-select
					v-model="point.transition"
					:options="['ease', 'ease-in', 'ease-in-out', 'ease-out', 'linear']"
					dense
				/>
				<div class="seven">
					<q-btn square unelevated color="red-7" icon="delete" class="button" />
				</div>
			</div>
		</div>
	</q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref, watch } from 'vue';
import { mapStore } from 'store/map';

interface cutsceneInterface {
	id: number;
	name: string;
	tag: string;
	duration: number;
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
		//#region General
		const storeMap = mapStore();
		const sideNav = ref<HTMLDivElement | null>(null);
		const drawerOpen = ref<boolean>(false);
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
		//#endregion General

		//#region Cutscene
		const cutsceneList = ref<cutsceneInterface[]>([]);
		const cutsceneSelected = ref<cutsceneInterface | null>(null);
		const cutscenePointsList = ref<cutscenePointInterface[] | null>(null);
		const cutsceneName = ref<string | null>(null);
		const createCutsceneModal = ref<boolean>(false);
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
			const points = await window.cutscene.getPoints(id);
			cutscenePointsList.value = points;
			points.forEach((p) => {
				if (cutsceneSelected.value)
					cutsceneSelected.value.duration += p.duration;
			});
		};

		const createCutscene = async () => {
			const data = await window.cutscene.create(String(cutsceneName.value));
			cutsceneList.value.push(data);
		};

		const modifyCutscene = async (id: number) => {
			console.log(id);
			// await window.cutscene.sql.update('UPDATE Cutscene SET Name = ? WHERE ID = ?', cutsceneName.value, id);
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
			if (cutsceneSelected.value)
				await window.cutscene.generate(cutsceneSelected.value.id);
		};
		//#endregion Cutscene
		
		onBeforeMount(() => {
			window.cutscene.init(storeMap.getMapPath(), storeMap.info.name)
				.then(() => getCutscenes());
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

		return {
			// General
			sideNav,
			drawerOpen,
			
			openNav,
			openFile,

			// Cutscene
			cutsceneList,
			cutsceneSelected,
			cutscenePointsList,
			createCutsceneModal,
			cutsceneName,

			printTime,
			getCutscenes,
			openCutscene,
			createCutscene,
			modifyCutscene,
			deleteCutscene,
			generateCutscene
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
	background-color: rgba(200, 200, 200, 0.5);
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
	align-items: center;
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
</style>
