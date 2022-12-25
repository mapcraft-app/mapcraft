<template>
	<div class="row justify-evenly q-ma-md">
		<div class="column justify-center items-center">
			<span class="text-body1">Shapeless</span>
			<q-toggle v-model="data.shapeless" size="xl" color="primary" :disable="data.exactPosition" />
		</div>
		<div class="column justify-center items-center">
			<span class="text-body1">Exact position</span>
			<q-toggle v-model="data.exactPosition" size="xl" color="primary" :disable="data.shapeless" />
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
				shapeless: boolean,
				exactPosition: boolean,
				group: string | null,
				outputName: string | null
			}>,
			required: true
		}
	},
	emits: ['change'],
	setup (props, { emit }) {
		const data = reactive({
			shapeless: props.config.shapeless,
			exactPosition: props.config.exactPosition,
			group: props.config.group,
			outputName: props.config.outputName
		});

		onMounted(() => {
			watch(props.config, (d) => {
				if (d) {
					data.exactPosition = d.exactPosition;
					data.group = d.group;
					data.outputName = d.outputName;
					data.shapeless = d.shapeless;
				}
			});
			watch(data, (newData) => {
				if (newData.shapeless)
					newData.exactPosition = false;
				emit('change', newData);
			});
		});

		return {
			data
		};
	}
});
</script>
