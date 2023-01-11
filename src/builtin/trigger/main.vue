<template>
	<div class="column">
		<div :class="(Quasar.dark.isActive) ? 'shadow-3 sticky dark' : 'shadow-3 sticky'">
			<div class="row justify-between q-pt-sm q-pb-sm">
				<q-input v-model="search" debounce="500" class="q-pl-md">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
				<q-btn
					color="green-7"
					class="q-ma-md"
					:label="$capitalize($t('builtin.trigger.main.create'))"
					@click="createTrigger(undefined)"
				/>
			</div>
			<div class="row no-wrap text-center">
				<div class="col-1">{{ $t('builtin.trigger.main.id') }}</div>
				<div class="col-3">{{ $capitalize($t('builtin.trigger.main.name')) }}</div>
				<div class="col-1">{{ $t('builtin.trigger.main.x1') }}</div>
				<div class="col-1">{{ $t('builtin.trigger.main.y1') }}</div>
				<div class="col-1">{{ $t('builtin.trigger.main.z1') }}</div>
				<div class="col-1">{{ $t('builtin.trigger.main.x2') }}</div>
				<div class="col-1">{{ $t('builtin.trigger.main.y2') }}</div>
				<div class="col-1">{{ $t('builtin.trigger.main.z2') }}</div>
			</div>
		</div>
		<div class="container">
			<template v-for="trigger of filter()" :key="trigger.id">
				<div class="row no-wrap line">
					<row-vue
						:data="trigger"
						@delete="deleteTrigger"
						@update="editTrigger"
						@edit-file="editFile"
					/>
				</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onBeforeMount, onUnmounted, ref, toRaw } from 'vue';
import { mapStore } from 'store/map';
import { createTrigger, triggerInterface } from './interface';
import rowVue from './components/row.vue';
import type { commandRet } from 'electron/api/shell/interface';
import shell from './shell';

export default defineComponent({
	name: 'Trigger',
	components: { rowVue },
	setup () {
		const Quasar = useQuasar();
		const storeMap = mapStore();
		const search = ref<string | null>(null);
		const triggers = ref<triggerInterface[]>([]);

		const random = (length = 16) => {
			const chars = '0123456789abcdef';
			let str = '';
			for (let i = 0; i < length; i++)
				str += chars.charAt(Math.floor(Math.random() * chars.length));
			return str;
		};

		const errorNotif = (e: any) => {
			Quasar.notify({
				position: 'top-right',
				color: 'red-7',
				icon: 'cancel',
				message: e,
				timeout: 2500
			});
			window.log.error('trigger', e);
		};

		const editFile = (id: number) => window.trigger.editFile(id);

		const createTrigger = (d: createTrigger | undefined = undefined) => {
			const data: createTrigger = (d)
				? { name: d.name ?? random(), x1: d.x1 ?? 0, y1: d.y1 ?? 0, z1: d.z1 ?? 0, x2: d.x2 ?? 0, y2: d.y2 ?? 0, z2: d.z2 ?? 0 }
				: { name: random(), x1: 0, y1: 0, z1: 0, x2: 0, y2: 0, z2: 0 };
			window.trigger.create(data)
				.then((ret) => {
					triggers.value.push(ret);
				})
				.catch((e) => errorNotif(e));
		};

		const editTrigger = (data: triggerInterface) => window.trigger.edit(toRaw(data));

		const deleteTrigger = (id: number) => {
			window.trigger.delete(id)
				.then(() => {
					const x = triggers.value.findIndex((e) => e.id === id);
					if (x !== -1)
						triggers.value.splice(x, 1);
				})
				.catch((e) => errorNotif(e));
		};

		const newCommand = (d: commandRet) => {
			if (d.command === shell.name && d.data) {
				createTrigger({
					x1: d.data.coordinates.p1[0],
					y1: d.data.coordinates.p1[1],
					z1: d.data.coordinates.p1[2],
					x2: d.data.coordinates.p2[0],
					y2: d.data.coordinates.p2[1],
					z2: d.data.coordinates.p2[2]
				});
			}
		};

		const filter = (): triggerInterface[] => {
			if (!search.value)
				return triggers.value;
			const __search = search.value.toLowerCase();
			return triggers.value.filter((e) => e.id === Number(search.value) || e.name.includes(__search));
		};

		onBeforeMount(() => {
			window.trigger.init(storeMap.getMapPath());
			window.trigger.get()
				.then((els) => {
					if (Array.isArray(els)) {
						triggers.value = els.map((e) => ({
							id: e.id,
							name: e.name,
							x1: e.x1, y1: e.y1, z1: e.z1,
							x2: e.x2, y2: e.y2, z2: e.z2
						}));
					} else {
						triggers.value = [{
							id: els.id,
							name: els.name,
							x1: els.x1, y1: els.y1, z1: els.z1,
							x2: els.x2, y2: els.y2, z2: els.z2
						}];
					}
				})
				.catch((e) => errorNotif(e));
			window.ipc.receiveAll('shell::command', newCommand);
		});

		onUnmounted(() => window.ipc.remove('shell::command', newCommand));

		return {
			Quasar,
			search,
			triggers,

			editFile,
			createTrigger,
			editTrigger,
			deleteTrigger,
			filter
		};
	}
});
</script>

<style scoped>
.page > div {
	height: inherit;
}
.container > .line:nth-child(2n + 1) {
	background-color: rgba(0, 0, 0, .1);
}
.line {
	padding-top: .2rem;
	padding-bottom: .2rem
}
.line > div {
	display: inline-flex;
	flex-wrap: nowrap;
	justify-content: space-around;
	align-content: center;
	align-items: center;
}

.sticky {
	z-index: 10;
	position: sticky;
	top: 0;
	background-color: #fff;
}
.dark {
	background-color: var(--q-dark-page);
}

.check {
	min-width: 5%;
}
.end {
	width: -webkit-fill-available;
}
</style>