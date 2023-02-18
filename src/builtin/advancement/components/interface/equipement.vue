<template>
	<div class="row no-wrap">
		<div class="body q-pa-sm" style="width: 25%">
			<img class="bodyPart head" :src="$toPublic('imgs/minecraft/body/head.webp')" @click="setPanel('head')" />
			<div class="middle">
				<img class="bodyPart hand" :src="$toPublic('imgs/minecraft/body/hand.webp')" @click="setPanel('mainhand')"/>
				<img class="bodyPart chestLegs" :src="$toPublic('imgs/minecraft/body/chest.webp')" @click="setPanel('chest')"/>
				<img class="bodyPart swipe hand" :src="$toPublic('imgs/minecraft/body/hand.webp')" @click="setPanel('offhand')"/>
			</div>
			<img class="bodyPart chestLegs" :src="$toPublic('imgs/minecraft/body/legs.webp')" @click="setPanel('legs')"/>
			<img class="bodyPart feets" :src="$toPublic('imgs/minecraft/body/feets.webp')" @click="setPanel('feet')"/>
		</div>
		<div class="tabs" style="width: 75%">
			<q-tab-panels
				v-model="panel"
				animated
				transition-prev="fade"
				transition-next="fade"
				class="rounded-borders"
			>
				<q-tab-panel name="head">
					<div class="row justify-center">
						<span class="text-h6 text-center">{{ $capitalize($t('builtin.advancement.interface.equipement.head')) }}</span>
					</div>
					<item v-model="data.head" />
				</q-tab-panel>
				<q-tab-panel name="chest">
					<div class="row justify-center">
						<span class="text-h6 text-center">{{ $capitalize($t('builtin.advancement.interface.equipement.chest')) }}</span>
					</div>
					<item v-model="data.chest" />
				</q-tab-panel>
				<q-tab-panel name="legs">
					<div class="row justify-center">
						<span class="text-h6 text-center">{{ $capitalize($t('builtin.advancement.interface.equipement.legs')) }}</span>
					</div>
					<item v-model="data.legs" />
				</q-tab-panel>
				<q-tab-panel name="feet">
					<div class="row justify-center">
						<span class="text-h6 text-center">{{ $capitalize($t('builtin.advancement.interface.equipement.feet')) }}</span>
					</div>
					<item v-model="data.feet" />
				</q-tab-panel>
				<q-tab-panel name="mainhand">
					<div class="row justify-center">
						<span class="text-h6 text-center">{{ $capitalize($t('builtin.advancement.interface.equipement.mainhand')) }}</span>
					</div>
					<item v-model="data.mainhand" />
				</q-tab-panel>
				<q-tab-panel name="offhand">
					<div class="row justify-center">
						<span class="text-h6 text-center">{{ $capitalize($t('builtin.advancement.interface.equipement.offhand')) }}</span>
					</div>
					<item v-model="data.offhand" />
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import item from './item.vue';
import { equipement } from '../../model';

type panelType = 'head' | 'chest' | 'legs' | 'feet' | 'mainhand' | 'offhand' | null;

export default defineComponent({
	name: 'InterfaceEquipement',
	components: {
		item
	},
	props: {
		modelValue: {
			type: [Object, null] as PropType<equipement | null>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<equipement>({
			head: props.modelValue?.head ?? null,
			chest: props.modelValue?.chest ?? null,
			legs: props.modelValue?.legs ?? null,
			feet: props.modelValue?.feet ?? null,
			mainhand: props.modelValue?.mainhand ?? null,
			offhand: props.modelValue?.offhand ?? null,
		} as equipement);
		const panel = ref<panelType>(null);

		const setPanel = (e: panelType) => panel.value = e;

		onBeforeMount(() => {
			watch(data, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			data,
			panel,
			setPanel
		};
	}
});
</script>

<style scoped>
.body {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 25%;
	height: 30em;
}
.tabs {
	height: 30em;
	max-height: 30em;
	overflow: auto;
}
.bodyPart {
	image-rendering: pixelated;
	image-rendering: -moz-crisp-edges;
	image-rendering: crisp-edges;
}
.bodyPart:hover {
	outline: 1px solid rgba(0, 0, 0, 1);
	outline-offset: -1px;
	cursor: pointer;
}
.bodyPart.swipe {
	transform: scaleX(-1);
}
.head {
	width: 5em;
	height: 5em;
}
.middle {
	height: 8em;
}
.chestLegs {
	width: 5em;
	height: 8em;
}
.hand {
	width: 2.5em;
	height: 8em;
}
.feets {
	width: 5em;
	height: 1.5em;
}
</style>
