<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="category"
			:label="$capitalize($t('builtin.advancement.interface.item.item'))"
			class="q-ma-xs"
		>
			<item v-model="data.item" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.select.entity'))"
			class="q-ma-xs"
		>
			<entity v-model="data.entity" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Item from '../../interface/item.vue';
import Entity from '../../interface/entityPlayer.vue';
import { player_interacted_with_entity } from '../../../interfaces/1.17_1.19';
import { entity, item } from '../../../model';

export default defineComponent({
	name: 'TabPlayerInteractedWithEntity',
	components: {
		Item,
		Entity
	},
	props: {
		modelValue: {
			type: Object as PropType<player_interacted_with_entity>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<player_interacted_with_entity>({
			item: props.modelValue.item ?? {} as item,
			entity: props.modelValue.entity ?? {} as entity
		} as player_interacted_with_entity);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
