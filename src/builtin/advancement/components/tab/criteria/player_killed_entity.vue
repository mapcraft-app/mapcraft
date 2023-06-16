<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.select.entity'))"
			class="q-ma-xs"
		>
			<entity v-model="data.entity" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="electric_bolt"
			:label="$capitalize($t('builtin.advancement.select.killingBlow'))"
			class="q-ma-xs"
		>
			<type v-model="data.killing_blow" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Entity from '../../interface/entityPlayer.vue';
import Type from '../../interface/type.vue';
import { player_killed_entity } from '../../../interfaces/1.17_1.19';
import { entity, type } from '../../../model';

export default defineComponent({
	name: 'TabPlayerKilledEntity',
	components: {
		Entity,
		Type
	},
	props: {
		modelValue: {
			type: Object as PropType<player_killed_entity>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<player_killed_entity>({
			entity: props.modelValue.entity ?? {} as entity,
			killing_blow: props.modelValue.killing_blow ?? {} as type
		} as player_killed_entity);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
