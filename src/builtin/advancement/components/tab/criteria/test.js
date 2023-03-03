const { existsSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const list = ['bee_nest_destroyed', 'bred_animals', 'brewed_potion', 'changed_dimension', 'channeled_lightning', 'construct_beacon', 'consume_item', 'cured_zombie_villager', 'effects_changed', 'enchanted_item', 'enter_block', 'entity_hurt_player', 'entity_killed_player', 'filled_bucket', 'fishing_rod_hooked', 'hero_of_the_village', 'inventory_changed', 'item_durability_changed', 'item_used_on_block', 'killed_by_crossbow', 'levitation', 'location', 'nether_travel', 'placed_block', 'player_generates_container_loot', 'player_hurt_entity', 'player_interacted_with_entity', 'player_killed_entity', 'recipe_unlocked', 'safely_harvest_honey', 'shot_crossbow', 'slept_in_bed', 'slide_down_block', 'summoned_entity', 'tame_animal', 'target_hit', 'thrown_item_picked_up_by_entity', 'tick', 'used_ender_eye', 'used_totem', 'villager_trade', 'voluntary_exile'];
const pascal = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace(/([-_][a-z])/g, group =>
	group
		.toUpperCase()
		.replace('-', '')
		.replace('_', '')
);
const snake = (s) => s.replace(/\W+/g, ' ')
	.split(/ |\B(?=[A-Z])/)
	.map((w) => w.toLowerCase())
	.join('_');

const source = (type) => `<template>\n\n</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';

import { ${snake(type)} } from '../../../conditions';

export default defineComponent({
	name: 'Tab${pascal(type)}',
	components: {

	},
	props: {
		modelValue: {
			type: Object as PropType<${snake(type)}>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<${snake(type)}>({} as ${snake(type)});

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
`;

let isCreate = false;
for (let i = 0; i < list.length; i++) {
	if (isCreate && process.argv[2] === 'next')
		break;
	if (!existsSync(resolve(__dirname, `${snake(list[i])}.vue`))) {
		writeFileSync(
			resolve(__dirname, `${snake(list[i])}.vue`),
			source(list[i]),
			{ encoding: 'utf-8', flag: 'w' }
		);
		isCreate = true;
	}
}
