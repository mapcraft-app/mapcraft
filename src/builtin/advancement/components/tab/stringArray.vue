<template>
	<div class="column items-center width">
		<q-btn
			icon="add" color="green-7" outline
			class="row"
			@click="addData"
		/>
		<div
			v-for="(_el, i) in data"
			:key="i"
			class="row no-wrap inline"
		>
			<q-input v-model="data[i]" dense :label="$capitalize($t('builtin.advancement.type.value'))" class="q-pr-sm"/>
			<q-btn flat color="red" icon="delete" @click="() => removeData(i)"/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';

export default defineComponent({
	name: 'StringArray',
	props: {
		modelValue: {
			type: [Array, null] as PropType<string[] | null>,
			required: true,
			default: () => []
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<string[]>(props.modelValue ?? []);
		const addData = () => data.value.push('');
		const removeData = (i: number) => data.value.splice(i, 1);

		onBeforeMount(() => watch(data, (val) => emit('update:modelValue', val), { deep: true }));

		return {
			data,
			addData,
			removeData
		};
	}
});
</script>

<style scoped>
.width {
	width: 100%;
}
.row {
	width: 400px;
}
</style>
