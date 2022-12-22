<template>
	<div class="row justify-evenly q-ma-md">
		<div class="column justify-center items-center">
			<span class="text-body1">Experience</span>
			<q-input
				v-model.number="data.experience"
				type="number"
				filled
				step="0.1" min="0"
				class="max-width"
			/>
		</div>
		<div class="column justify-center items-center">
			<span class="text-body1">Waiting time</span>
			<q-input
				v-model.number="data.time"
				type="number"
				step="0.1" min="0"
				class="max-width"
			>
				<template v-slot:append>
					<span>s</span>
				</template>
			</q-input>
		</div>
		<div class="column justify-center items-center">
			<span class="text-body1">Group</span>
			<q-input v-model="data.group" label="Group" />
		</div>
		<div class="column justify-center items-center">
			<span class="text-body1">Output name</span>
			<q-input v-model="data.outputName" label="Output Name" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
	name: 'OptionTable',
	props: {
		config: {
			type: Object as PropType<{
				experience: number,
				time: number,
				group: string | null,
				outputName: string | null
			}>,
			required: true
		}
	},
	emits: ['change'],
	setup (props, { emit }) {
		const data = reactive({
			experience: props.config.experience,
			time: props.config.time,
			group: props.config.group,
			outputName: props.config.outputName
		});

		onMounted(() => {
			watch(data, (newData) => {
				emit('change', newData);
			});
		});

		return {
			data
		};
	}
});
</script>

<style scoped>
.max-width {
	width: 6em;
}
</style>