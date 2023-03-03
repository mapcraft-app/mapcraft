<template>
	<number-range
		v-model="data.unique_entity_types"
		:label="$capitalize($t('builtin.advancement.tab.killedBy.unique'))"
	/>
	<div class="full-width text-center q-pt-sm">
		<span class="text-h6 text-weight-light">{{ $capitalize($t('builtin.advancement.tab.killedBy.victims')) }}</span>
	</div>
	<q-list bordered class="q-mt-sm">
		<q-btn
			icon="add" class="full-width"
			unelevated outline color="green"
			@click="() => addVictim()"
		/>
		<q-expansion-item
			v-for="(_i, index) of data.victims"
			:key="index"
			expand-separator
			icon="person"
			:label="`Victim ${index + 1}`"
			class="q-ma-xs"
		>
			<q-btn
				icon="remove" class="full-width q-ma-md"
				unelevated outline color="red"
				@click="() => removeVictim(index)"
			/>
			<entity-player v-model="data.victims[index]" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import NumberRange from '../../type/numberRange.vue';
import EntityPlayer from '../../interface/entityPlayer.vue';
import { killed_by_crossbow } from '../../../conditions';
import { entity } from '../../../model';

export default defineComponent({
	name: 'TabKilledByCrossbow',
	components: {
		NumberRange,
		EntityPlayer
	},
	props: {
		modelValue: {
			type: Object as PropType<killed_by_crossbow>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<killed_by_crossbow>({
			unique_entity_types: props.modelValue.unique_entity_types ?? 0,
			victims: [ ...props.modelValue.victims ?? [] ]
		} as killed_by_crossbow);

		const addVictim = () => data.value.victims.push({} as entity);
		const removeVictim = (id: number) => data.value.victims.splice(id, 1);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data,
			addVictim,
			removeVictim
		};
	}
});
</script>
