<template>
	<div class="col-1">{{ trigger.id }}</div>
	<q-input
		v-model="trigger.name"
		type="text" dense :rules="[val => val.length > 0]"
		class="col-3 q-pl-xs q-pr-xs"
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
	<div class="end">
		<q-btn square unelevated color="light-blue-7" icon="play_arrow" @click="editFile(trigger.id)" />
		<q-btn square unelevated color="red-7" icon="delete">
			<q-popup-proxy>
				<q-card square>
					<q-card-section class="column">
						<span class="text-center">Are you sure ?</span>
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
		const trigger = ref<triggerInterface>({
			id: props.data.id,
			name: props.data.name,
			x1: props.data.x1,
			y1: props.data.y1,
			z1: props.data.z1,
			x2: props.data.x2,
			y2: props.data.y2,
			z2: props.data.z2
		});
		const editFile = (id: number) => emit('editFile', id);
		const deleteTrigger = (id: number) => emit('delete', id);
		
		onMounted(() => {
			watch(trigger, (after) => {
				console.log('hello');
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
.end {
	width: -webkit-fill-available;
}
</style>