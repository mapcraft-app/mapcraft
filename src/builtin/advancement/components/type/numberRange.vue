<template>
	<div class="row">
		<q-input
			v-model.number="minVal"
			type="number"
			outlined
			style="max-width: 40%"
			class="q-pr-md"
			:min="$props.min"
			:max="$props.max"
		/>
		<q-input
			v-model.number="maxVal"
			type="number"
			outlined
			class="q-pr-md"
			:disable="!toggle"
			:min="$props.min"
			:max="$props.max"
		/>
		<q-toggle
			v-model="toggle"
			label="Set range"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue';

export default defineComponent({
	name: 'NumberRange',
	props: {
		modelValue: {
			type: [Object, Number] as PropType<{ min: number, max?: number } | number>,
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
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const toggle = ref<boolean>(false);
		const minVal = ref<number>(
			(typeof props.modelValue === 'number')
				? props.modelValue ?? 0
				: props.modelValue.min ?? 0
		);
		const maxVal = ref<number>(
			(typeof props.modelValue === 'number')
				? props.modelValue ?? 0
				: props.modelValue.max ?? 0
		);
		
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
