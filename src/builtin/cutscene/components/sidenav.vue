<template>
	<q-btn
		color="green-7" square unelevated
		size="1.3em"
		class="full-width"
		icon="add" :title="$capitalize($t('builtin.cutscene.list.add'))"
		@click="() => createCutsceneModal = true"
	/>
	<q-list v-if="$props.list.length" separator>
		<q-slide-item
			v-for="cutscene in $props.list"
			:key="cutscene.id" clickable
			right-color="red-7"
			:class="!$q.dark.isActive ? 'main-layout-day' : 'main-layout-night'"
			@click="openCutscene(cutscene.id)"
			@right="deleteCutscene(cutscene.id)"
		>
			<template v-slot:right>
				<q-icon name="delete"/>
			</template>
			<q-item :class="{
				'element-selected': (cutsceneSelectedId === cutscene.id),
				row: true
			}">
				<q-item-section no-wrap>
					<span class="q-mr-md">
					<q-icon name="sell" class="q-mr-xs" />
						{{ cutscene.name }}
					</span>
				</q-item-section>
				<q-item-section no-wrap>
					<span>
						<q-icon name="tag" class="q-mr-xs" />
						{{ cutscene.tag }}
					</span>
				</q-item-section>
			</q-item>
		</q-slide-item>
	</q-list>
	<q-dialog v-model="createCutsceneModal" persistent>
		<q-card style="width: 40%">
			<q-card-section class="q-pt-none">
				<q-input
					v-model="modalCutsceneName"
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
				<q-btn
					v-close-popup
					square
					color="green-7"
					icon="check"
					@click="createCutscene()"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount, ref, PropType } from 'vue';
import { cutsceneInterface } from '../interface';
import { ipcCommand } from '@/electron/api/shell/interface';
import shell from '../shell';

export default defineComponent({
	name: 'Sidenav',
	props: {
		list: {
			type: Array as PropType<cutsceneInterface[]>,
			required: true
		}
	},
	emits: ['selected', 'created', 'deleted'],
	setup (props, { emit }) {
		const drawerOpen = ref<boolean>(false);
		const createCutsceneModal = ref<boolean>(false);
		const modalCutsceneName = ref<string | null>(null);
		const cutsceneSelectedId = ref<number>(-1);

		const openCutscene = (id: number) => {
			window.mapcraft.clipboard.writeText(`cutscene_${id}`);
			const x = props.list.findIndex((e) => e.id === id);
			cutsceneSelectedId.value = id;
			emit('selected', x);
		};

		const createCutscene = () => {
			if (modalCutsceneName.value) {
				emit('created', modalCutsceneName.value);
				modalCutsceneName.value = null;
			}
		};

		const deleteCutscene = (id: number) => emit('deleted', id);

		const handleCommand = (command: ipcCommand) => {
			if (command.ret.command === shell.name
				&& command.ret.data
				&& command.ret.data.type === 'create')
				createCutsceneModal.value = true;
		};

		onBeforeMount(() => window.ipc.receiveAll('shell::command', handleCommand));
		onBeforeUnmount(() => window.ipc.remove('shell::command', handleCommand));

		return {
			drawerOpen,
			createCutsceneModal,
			modalCutsceneName,
			cutsceneSelectedId,
	
			openCutscene,
			createCutscene,
			deleteCutscene
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
.drawer-open {
	left: 250px;
	visibility: visible;
	opacity: 1
}
.drawer-close {
	left: 0;
}
.element-selected {
	background-color: rgba(170, 170, 170, 0.2);
}
</style>
