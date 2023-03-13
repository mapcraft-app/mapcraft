<template>
	<div class="row">
		<q-toggle
			v-model="selectedAdvancement.child.data.utility"
			:label="$capitalize($t('builtin.advancement.tab.display.utility[0]'))"
			left-label
			@update:model-value="isUpdate()"
		>
			<q-tooltip class="bg-indigo text-subtitle2" anchor="center end" self="center left">
				{{ $capitalize($t('builtin.advancement.tab.display.utility[1]')) }}
			</q-tooltip>
		</q-toggle>
	</div>
	<q-slide-transition>
		<div v-show="!selectedAdvancement.child.data.utility">
			<div class="column items-start">
				<q-card flat square bordered class="full-width q-mt-xs q-mb-xs">
					<q-card-section v-if="isError.length > 0 && isError.length < 3 && isError.includes('title')">
						<q-banner class="text-white bg-red">
							{{ $capitalize($t('builtin.advancement.tab.display.errors[0]')) }}
						</q-banner>
					</q-card-section>
					<q-card-section>
						<display-title
							v-model="selectedAdvancement.child.data.display.title"
							:title="$capitalize($t('builtin.advancement.tab.display.title'))"
							@update:model-value="isUpdate()"
						/>
					</q-card-section>
				</q-card>
				<q-card flat square bordered class="full-width q-mt-xs q-mb-xs">
					<q-card-section v-if="isError.length > 0 && isError.length < 3 && isError.includes('description')">
						<q-banner class="text-white bg-red">
							{{ $capitalize($t('builtin.advancement.tab.display.errors[1]')) }}
						</q-banner>
					</q-card-section>
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
				:error="isError.length > 0 && isError.length < 3 && isError.includes('icon')"
				:label="$capitalize($t('builtin.advancement.tab.display.iconItem'))"
				@update:model-value="isUpdate()"
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
		</div>
	</q-slide-transition>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import DisplayTitle from './title.vue';
import { titleModel } from '../../../model';
import { selectedAdvancement } from '../../../lib/handleAdv';
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
		if (!Object.prototype.hasOwnProperty.call(selectedAdvancement.value.child.data, 'utility'))
			selectedAdvancement.value.child.data.utility = false;
		if (!Object.prototype.hasOwnProperty.call(selectedAdvancement.value.child.data.display, 'title'))
			selectedAdvancement.value.child.data.display.title = { text: '', color: 'white' } as titleModel;
		if (!Object.prototype.hasOwnProperty.call(selectedAdvancement.value.child.data.display, 'description'))
			selectedAdvancement.value.child.data.display.description = { text: '', color: 'white' } as titleModel;
		
		const isError = computed((): string[] => {
			let isSet: string[] = [];
			if (Object.prototype.hasOwnProperty.call(selectedAdvancement.value.child.data, 'display')) {
				if (!Object.keys(selectedAdvancement.value.child.data.display.title).length)
					isSet.push('title');
				if (!Object.keys(selectedAdvancement.value.child.data.display.description).length)
					isSet.push('description');
				if (!Object.prototype.hasOwnProperty.call(selectedAdvancement.value.child.data.display.icon, 'item'))
					isSet.push('icon');
			}
			return isSet;
		});
		const isUpdate = () => emit('update');

		return {
			selectedAdvancement,
			isError,
			isUpdate
		};
	}
});
</script>
