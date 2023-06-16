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
			:label="$capitalize($t('builtin.advancement.interface.damage.damage'))"
			class="q-ma-xs"
		>
			<damage v-model="data.damage" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Entity from '../../interface/entityPlayer.vue';
import Damage from '../../interface/damage.vue';
import { player_hurt_entity } from '../../../interfaces/1.17_1.19';
import { damage, entity } from '../../../model';

export default defineComponent({
	name: 'TabPlayerHurtEntity',
	components: {
		Entity,
		Damage
	},
	props: {
		modelValue: {
			type: Object as PropType<player_hurt_entity>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<player_hurt_entity>({
			entity: props.modelValue.entity ?? {} as entity,
			damage: props.modelValue.damage ?? {} as damage
		} as player_hurt_entity);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
