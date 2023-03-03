<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="supervisor_account"
			:label="$capitalize($t('builtin.advancement.tab.bredAnimals.child'))"
			class="q-ma-xs"
		>
			<interface-entity v-model="data.child" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.tab.bredAnimals.parent'))"
			class="q-ma-xs"
		>
			<interface-entity v-model="data.parent" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="group"
			:label="$capitalize($t('builtin.advancement.tab.bredAnimals.partner'))"
			class="q-ma-xs"
		>
			<interface-entity v-model="data.partner" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceEntity from '../../interface/entityPlayer.vue';
import { bred_animals } from '../../../conditions';
import { entity } from '../../../model';

export default defineComponent({
	name: 'TabBredAnimals',
	components: {
		InterfaceEntity
	},
	props: {
		modelValue: {
			type: Object as PropType<bred_animals>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<bred_animals>({
			child: props.modelValue.child ?? {} as entity,
			parent: props.modelValue.parent ?? {} as entity,
			partner: props.modelValue.partner ?? {} as entity
		} as bred_animals);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
