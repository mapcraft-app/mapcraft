<template>
	<number-range v-model="data.level" :label="$capitalize($t('builtin.advancement.interface.entityPlayer.level'))"/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import NumberRange from '../../type/numberRange.vue';
import { construct_beacon } from '../../../interfaces/1.17_1.19';

export default defineComponent({
	name: 'TabConstructBeacon',
	components: {
		NumberRange
	},
	props: {
		modelValue: {
			type: Object as PropType<construct_beacon>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<construct_beacon>({
			level: props.modelValue.level ?? 0
		} as construct_beacon);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
