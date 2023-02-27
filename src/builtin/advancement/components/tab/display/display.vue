<template>
	<div class="column items-start">
		<q-card flat square bordered class="full-width q-mt-xs q-mb-xs">
			<q-card-section>
				<display-title
					v-model="$props.modelValue.title"
					title="Title"
				/>
			</q-card-section>
		</q-card>
		<q-card flat square bordered class="full-width q-mt-xs q-mb-xs">
			<q-card-section>
				<display-title
					v-model="$props.modelValue.description"
					title="Description"
				/>
			</q-card-section>
		</q-card>
	</div>
	<block-item
		v-model="$props.modelValue.icon.item"
		:block="true"
		:item="true"
		label="Icon item"
	/>
	<q-input
		v-model="$props.modelValue.icon.nbt"
		label="Nbt"
	/>
	<select-frame
		v-model="$props.modelValue.frame"
		label="Frame"
	/>
	<div class="row no-wrap justify-around">
		<q-toggle
			v-model="$props.modelValue.show_toast"
			label="Show toast ?"
		/>
		<q-toggle
			v-model="$props.modelValue.announce_to_chat"
			label="Announce to chat ?"
		/>
		<q-toggle
			v-model="$props.modelValue.hidden"
			label="Hidden ?"
		/>

	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, watch } from 'vue';
import DisplayTitle from './title.vue';
import BlockItem from '../../select/blockItem.vue';
import SelectFrame from '../../select/frame.vue';
import { display } from '../../../model';

export default defineComponent({
	name: 'DisplayMain',
	components: {
		DisplayTitle,
		BlockItem,
		SelectFrame
	},
	props: {
		modelValue: {
			type: Object as PropType<display>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		
		onBeforeMount(() => {
			watch(props.modelValue, (val) => emit('update:modelValue', val), { deep: true });
		});
	}
});
</script>
