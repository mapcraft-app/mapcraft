<template>
	<div class="col-1 row items-center justify-center">
		<q-badge color="light-blue-7">{{ trigger.id }}</q-badge>
	</div>
	<q-input
		v-model="trigger.name"
		type="text" dense :rules="[val => val.length > 0]"
		class="col-2 q-pl-xs q-pr-xs"
		hide-bottom-space
		debounce="250"
	/>
	<q-input
		v-model.number="trigger.x1"
		type="number" dense :rules="[val => val]"
		class="col-1 q-pl-xs q-pr-xs"
		hide-bottom-space
		debounce="250"
	/>
	<q-input
		v-model.number="trigger.y1"
		type="number" dense :rules="[val => val]"
		class="col-1 q-pl-xs q-pr-xs"
		hide-bottom-space
		debounce="250"
	/>
	<q-input
		v-model.number="trigger.z1"
		type="number" dense :rules="[val => val]"
		class="col-1 q-pl-xs q-pr-xs"
		hide-bottom-space
		debounce="250"
	/>
	<q-input
		v-model.number="trigger.x2"
		type="number" dense :rules="[val => val]"
		class="col-1 q-pl-xs q-pr-xs"
		hide-bottom-space
		debounce="250"
	/>
	<q-input
		v-model.number="trigger.y2"
		type="number" dense :rules="[val => val]"
		class="col-1 q-pl-xs q-pr-xs"
		hide-bottom-space
		debounce="250"
	/>
	<q-input
		v-model.number="trigger.z2"
		type="number" dense :rules="[val => val]"
		class="col-1 q-pl-xs q-pr-xs"
		hide-bottom-space
		debounce="250"
	/>
	<div class="col-1 row justify-center items-center">
		<q-toggle
			v-model="trigger.onlyOnce"
			:false-value="0"
			:true-value="1"
		/>
	</div>
	<div class="end row justify-center items-center">
		<q-btn square unelevated color="light-blue-7" icon="play_arrow" @click="editFile(trigger.id)" />
		<q-btn square unelevated color="red-7" icon="delete">
			<q-popup-proxy>
				<q-card square>
					<q-card-section class="column">
						<span class="text-center">
							{{ $capitalize($t('builtin.trigger.main.delete')) }}
						</span>
						<q-btn icon="delete" color="red-7" @click="deleteTrigger(trigger.id)"/>
					</q-card-section>
				</q-card>
			</q-popup-proxy>
		</q-btn>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, watch } from 'vue';
import { triggerInterface } from '../interface';

export default defineComponent({
	name: 'Row',
	props: {
		data: {
			type: Object as PropType<triggerInterface>,
			default: {} as triggerInterface,
			required: true
		}
	},
	emits: ['update', 'editFile', 'delete'],
	setup (props, { emit }) {
		const trigger = ref<triggerInterface>({ ...props.data });
		const editFile = (id: number) => emit('editFile', id);
		const deleteTrigger = (id: number) => emit('delete', id);
		
		onMounted(() => {
			watch(trigger, (after) => {
				if (after)
					emit('update', after);
			}, { deep: true });
		});

		return {
			trigger,
			editFile,
			deleteTrigger
		};
	}
});
</script>

<style scoped>
.end {
	width: -webkit-fill-available;
}
</style>
