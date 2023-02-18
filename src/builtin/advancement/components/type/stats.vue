<template>
	<div class="column items-start width">
		<q-btn
			icon="add" color="green-7" outline
			class="max-width"
			@click="addStats"
		/>
		<div
			v-for="(el, i) in stats"
			:key="i"
			class="row inline"
		>
			<select-stats v-model="el.type" />
			<q-input v-model="el.stat" dense :label="$capitalize($t('builtin.advancement.type.stat'))" class="q-pr-sm" />
			<type-number-range v-model="el.value" />
			<q-btn flat color="red" icon="delete" @click="removeStats(i)"/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onBeforeMount } from 'vue';
import SelectStats from '../select/stats.vue';
import TypeNumberRange from '../type/numberRange.vue';
import { stats } from '../../model';

export default defineComponent({
	name: 'TypeStats',
	components: {
		SelectStats,
		TypeNumberRange
	},
	props: {
		modelValue: {
			type: [Array, null] as PropType<stats[] | null>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const stats = ref<stats[]>([]);

		const addStats = () => stats.value.push({ type: null, stat: null, value: null });

		const removeStats = (i: number) => stats.value.splice(i, 1);
		
		onBeforeMount(() => {
			if (props.modelValue)
				stats.value = props.modelValue;
			watch(stats, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			stats,

			addStats,
			removeStats
		};
	}
});
</script>

<style scoped>
.width {
	width: 390px;
}
.max-width {
	width: 100%;
}
</style>