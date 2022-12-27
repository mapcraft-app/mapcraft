<template>
	<q-page>
		<div class="column">
			<div class="row justify-between q-pt-sm q-pb-sm">
				<q-checkbox
					v-model="selectAllTriggers"
					toogle-indeterminate
					label="Select every trigger"
				/>
				<q-btn
					color="green-7"
					label="Create new trigger"
					class="q-ma-md"
					@click="createTrigger"
				/>
			</div>
			<div class="row no-wrap text-center">
				<div class="check"></div>
				<div class="col-1">ID</div>
				<div class="col-2">Name</div>
				<div class="col-1">X1</div>
				<div class="col-1">Y1</div>
				<div class="col-1">Z1</div>
				<div class="col-1">X2</div>
				<div class="col-1">Y2</div>
				<div class="col-1">Z2</div>
			</div>
			<div class="container">
				<div
					v-for="trigger of triggers"
					:key="trigger.id"
					class="row no-wrap line"
				>
					<div class="check">
						<q-checkbox v-model.boolean="trigger.select" />
					</div>
					<div class="col-1">{{ trigger.id }}</div>
					<q-input
						v-model="trigger.name"
						type="text" dense :rules="[val => val.length > 0]"
						hide-bottom-space
						class="col-2 q-pl-xs q-pr-xs"
					/>
					<q-input
						v-model.number="trigger.x1"
						type="number" dense :rules="[val => !!val || '']"
						class="col-1 q-pl-xs q-pr-xs"
						hide-bottom-space
					/>
					<q-input
						v-model.number="trigger.y1"
						type="number" dense :rules="[val => !!val || '']"
						class="col-1 q-pl-xs q-pr-xs"
						hide-bottom-space
					/>
					<q-input
						v-model.number="trigger.z1"
						type="number" dense :rules="[val => !!val || '']"
						class="col-1 q-pl-xs q-pr-xs"
						hide-bottom-space
					/>
					<q-input
						v-model.number="trigger.x2"
						type="number" dense :rules="[val => !!val || '']"
						class="col-1 q-pl-xs q-pr-xs"
						hide-bottom-space
					/>
					<q-input
						v-model.number="trigger.y2"
						type="number" dense :rules="[val => !!val || '']"
						class="col-1 q-pl-xs q-pr-xs"
						hide-bottom-space
					/>
					<q-input
						v-model.number="trigger.z2"
						type="number" dense :rules="[val => !!val || '']"
						class="col-1 q-pl-xs q-pr-xs"
						hide-bottom-space
					/>
					<div class="end">
						<q-btn square unelevated color="light-blue-7" icon="play_arrow"/>
						<q-btn square unelevated color="red-7" icon="delete" />
					</div>
				</div>
			</div>
			
		</div>
	</q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapStore } from 'store/map';
import { triggerInterface, triggerList } from './interface';

export default defineComponent({
	name: 'Trigger',
	setup () {
		const $q = useQuasar();
		const storeMap = mapStore();
		const { t } = useI18n();

		const triggers = ref<triggerList[]>([]);
		const selectAllTriggers = ref<boolean | null>(null);

		const editFile = (id: number) => window.trigger.editFile(id);
		const createTrigger = () => {
			console.log('create');
		};
		const editTrigger = (data: triggerInterface) => window.trigger.edit(data);
		const deleteTrigger = (id: number) => window.trigger.delete(id);

		onBeforeMount(() => {
			window.trigger.init(storeMap.getMapPath());
			window.trigger.get()
				.then((els) => {
					if (Array.isArray(els)) {
						triggers.value = els.map((e) => ({
							select: false,
							id: e.id,
							name: e.name,
							x1: e.x1, y1: e.y1, z1: e.z1,
							x2: e.x2, y2: e.y2, z2: e.z2
						}));
					} else {
						triggers.value = [{
							select: false,
							id: els.id,
							name: els.name,
							x1: els.x1, y1: els.y1, z1: els.z1,
							x2: els.x2, y2: els.y2, z2: els.z2
						}];
					}
				})
				.catch((e) => console.error(e));
		});

		onMounted(() => {
			watch(selectAllTriggers, (after) => {
				if (after === null)
					return;
				triggers.value.forEach((e) => e.select = after);
			});
			watch(triggers, (after) => {
				console.log(after);
				if (after === null)
					return;
				let isCheck = 0;
				triggers.value.forEach((e) => {
					if (e.select)
						++isCheck;
				});
				if (isCheck >= triggers.value.length)
					selectAllTriggers.value = true;
				else if (isCheck < triggers.value.length && isCheck > 0)
					selectAllTriggers.value = null;
				else
					selectAllTriggers.value = false;
			}, { deep: true });
		});

		onUnmounted(() => {
			console.log('unmounted');
		});

		return {
			triggers,
			selectAllTriggers,

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