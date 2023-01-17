<template>
	<div class="row">
		<q-input
			v-model.number="minVal"
			type="number"
			outlined
			style="max-width: 40%"
			class="q-pr-md"
			:dense="$props.dense"
			:min="$props.min"
			:max="$props.max"
		/>
		<q-input
			v-model.number="maxVal"
			type="number"
			outlined
			class="q-pr-md"
			:disable="!toggle"
			:dense="$props.dense"
			:min="$props.min"
			:max="$props.max"
			:rules="[v => toggle && minVal <= maxVal]"
		/>
		<q-toggle
			v-model="toggle"
			label="Set range"
			:dense="$props.dense"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue';

interface range {
	min: number,
	max?: number
}

export default defineComponent({
	name: 'NumberRange',
	props: {
		modelValue: {
			type: [Object, Number, null] as PropType<range | number | null>,
			required: true
		},
		min: {
			type: Number,
			required: false,
			default: 0
		},
		max: {
			type: Number,
			required: false,
			default: 64
		},
		dense: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const toggle = ref<boolean>(false);
		const getData = (el: range | number | null, min = true) => {
			if (el === null)
				return 0;
			if (typeof el === 'number')
				return el ?? 0;
			return (min)
				? el.min
				: el.max ?? 0;
		};
		const minVal = ref<number>(getData(props.modelValue, true));
		const maxVal = ref<number>(getData(props.modelValue, false));
		
		onMounted(() => {
			watch(toggle, (after, before) => {
				if (!after && before)
					maxVal.value = 0;
			});

			watch(minVal, (after) => {
				if (after) {
					emit('update:modelValue', {
						min: minVal.value,
						max: (!toggle.value)
							? undefined
							: maxVal.value
					});
				}
			});

			watch(maxVal, (after) => {
				if (after) {
					emit('update:modelValue', {
						min: minVal.value,
						max: (!toggle.value)
							? undefined
							: maxVal.value
					});
				}
			});
		});

		return {
			toggle,
			minVal,
			maxVal
		};
	}
});
</script>
