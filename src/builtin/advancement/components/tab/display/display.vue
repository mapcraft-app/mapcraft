<template>
	<div class="column items-start">
		<q-card flat square bordered class="full-width q-mt-xs q-mb-xs">
			<q-card-section>
				<display-title
					v-model="selectedAdvancement.child.data.display.title"
					:title="$capitalize($t('builtin.advancement.tab.display.title'))"
					@update:model-value="isUpdate()"
				/>
			</q-card-section>
		</q-card>
		<q-card flat square bordered class="full-width q-mt-xs q-mb-xs">
			<q-card-section>
				<display-title
					v-model="selectedAdvancement.child.data.display.description"
					:title="$capitalize($t('builtin.advancement.tab.display.description'))"
				/>
			</q-card-section>
		</q-card>
	</div>
	<block-item
		v-model="selectedAdvancement.child.data.display.icon.item"
		:block="true"
		:item="true"
		:label="$capitalize($t('builtin.advancement.tab.display.iconItem'))"
	/>
	<q-input
		v-model="selectedAdvancement.child.data.display.icon.nbt"
		:label="$capitalize($t('builtin.advancement.tab.display.nbt'))"
	/>
	<select-frame
		v-model="selectedAdvancement.child.data.display.frame"
		:label="$capitalize($t('builtin.advancement.tab.display.frame'))"
	/>
	<div class="row no-wrap justify-around">
		<q-toggle
			v-model="selectedAdvancement.child.data.display.show_toast"
			:label="$capitalize($t('builtin.advancement.tab.display.toast'))"
		/>
		<q-toggle
			v-model="selectedAdvancement.child.data.display.announce_to_chat"
			:label="$capitalize($t('builtin.advancement.tab.display.chat'))"
		/>
		<q-toggle
			v-model="selectedAdvancement.child.data.display.hidden"
			:label="$capitalize($t('builtin.advancement.tab.display.hidden'))"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DisplayTitle from './title.vue';
import { selectedAdvancement } from '../../../lib/getChild';
import BlockItem from '../../select/blockItem.vue';
import SelectFrame from '../../select/frame.vue';

export default defineComponent({
	name: 'DisplayMain',
	components: {
		DisplayTitle,
		BlockItem,
		SelectFrame
	},
	emits: ['update'],
	setup (_props, { emit }) {
		return {
			selectedAdvancement,
			isUpdate: () => emit('update')
		};
	}
});
</script>
