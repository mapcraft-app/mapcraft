<template>
	<template
		v-for="(criteria, i) of $props.modelValue"
		:key="i"
	>
		<bee-nest-destroyed v-if="criteria.trigger === 'bee_nest_destroyed'" v-model="$props.modelValue[i].conditions"/>
		<!--
		<bred-animals v-else-if="criteria.trigger === 'brewed_potion'" v-model="$props.modelValue[i].conditions"/>
		-->
		<template v-else>
			<span>Not found</span>
		</template>
	</template>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, watch } from 'vue';

import BeeNestDestroyed from './bee_nest_destroyed.vue';

import { criteria } from '../../../conditions';
import { trigger } from '../../../model';

export default defineComponent({
	name: 'TabCriteria',
	components: {
		BeeNestDestroyed,
	},
	props: {
		modelValue: {
			type: Object as PropType<Record<criteria, trigger>>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		onBeforeMount(() => {
			watch(props.modelValue, (val) => emit('update:modelValue', val));
		});
	}
});
</script>

<style scoped>
</style>
