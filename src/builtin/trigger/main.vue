<template>
	<q-page>
		<div class="column">
			<div class="row reverse q-pt-sm q-pb-sm">
				<q-btn
					color="green-7"
					label="Create new trigger"
					class="q-ma-md"
					@click="createTrigger(undefined)"
				/>
			</div>
			<div class="row no-wrap text-center">
				<div class="col-1">ID</div>
				<div class="col-3">Name</div>
				<div class="col-1">X1</div>
				<div class="col-1">Y1</div>
				<div class="col-1">Z1</div>
				<div class="col-1">X2</div>
				<div class="col-1">Y2</div>
				<div class="col-1">Z2</div>
			</div>
			<div class="container">
				<template v-for="trigger of triggers" :key="trigger.id">
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
	</q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onBeforeMount, ref, toRaw } from 'vue';
import { mapStore } from 'store/map';
import { createTrigger, triggerInterface } from './interface';
import rowVue from './components/row.vue';

export default defineComponent({
	name: 'Trigger',
	components: { rowVue },
	setup () {
		const $q = useQuasar();
		const storeMap = mapStore();
		// const { t } = useI18n();
		const triggers = ref<triggerInterface[]>([]);

		const random = (length = 16) => {
			const chars = '0123456789abcdef';
			let str = '';
			for (let i = 0; i < length; i++)
				str += chars.charAt(Math.floor(Math.random() * chars.length));
			return str;
		};

		const errorNotif = (e: any) => {
			$q.notify({
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
		});

		return {
			triggers,

			editFile,
			createTrigger,
			editTrigger,
			deleteTrigger
		};
	}
});
</script>

<style scoped>
.page > div {
	height: inherit;
}
.container > .line:nth-child(2n + 1) {
	background-color: rgb(235, 235, 235);
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

.check {
	min-width: 5%;
}
.end {
	width: -webkit-fill-available;
}
</style>