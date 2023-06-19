<template>
	<div class="column items-start width">
		<q-btn
			icon="add" color="green-7" outline
			class="max-width"
			@click="addState"
		/>
		<div
			v-for="(el, i) in states"
			:key="i"
			class="row no-wrap full-width justify-between"
		>
			<q-input v-model="el.key" dense :label="$capitalize($t('builtin.advancement.type.key'))" />
			<q-input v-model="el.value" dense :label="$capitalize($t('builtin.advancement.type.value'))" />
			<q-btn flat color="red" icon="delete" @click="removeState(i)"/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onBeforeMount } from 'vue';
import { state } from '../../model';

interface stateInterface {
	key: string,
	value: string
}

export default defineComponent({
	name: 'TypeState',
	props: {
		modelValue: {
			type: Object as PropType<state | null>,
			required: false,
			default: null
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const states = ref<stateInterface[]>([]);
		if (props.modelValue) {
			for (const key in props.modelValue)
				states.value.push({ key, value: props.modelValue[key] });
		}

		const addState = () => states.value.push({ key: '', value: '' });

		const removeState = (i: number) => states.value.splice(i, 1);
		
		onBeforeMount(() => {
			watch(states, (after) => {
				if (after) {
					const ret: state = {};
					for (const el of states.value) {
						if (el.key)
							ret[el.key] = el.value ?? '';
					}
					emit('update:modelValue', ret);
				}
			}, { deep: true });
		});

		return {
			states,

			addState,
			removeState
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