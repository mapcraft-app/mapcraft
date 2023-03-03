<template>
	<q-btn
		icon="add" class="full-width"
		unelevated outline color="green"
		@click="() => addVictim()"
	/>
	<template v-if="data.victims.length">
		<q-list bordered class="q-mt-sm">
			<q-expansion-item
				v-for="(_v, index) of data.victims"
				:key="index"
				expand-separator
				icon="man_4"
				:label="`Victim ${index}`"
				class="q-ma-xs"
			>
				<q-btn
					icon="remove" class="full-width q-ma-md"
					unelevated outline color="red"
					@click="() => removeVictim(index)"
				/>
				<interface-entity v-model="data.victims[index]" />
			</q-expansion-item>
		</q-list>
	</template>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceEntity from '../../interface/entityPlayer.vue';
import { channeled_lightning } from '../../../conditions';
import { entity } from '../../../model';

export default defineComponent({
	name: 'TabChanneledLightning',
	components: {
		InterfaceEntity
	},
	props: {
		modelValue: {
			type: Object as PropType<channeled_lightning>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<channeled_lightning>({
			victims: [ ...props.modelValue.victims ?? [] ]
		} as channeled_lightning);

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
