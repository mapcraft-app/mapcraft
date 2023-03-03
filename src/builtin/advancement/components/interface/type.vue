<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			:label="$capitalize($t('builtin.advancement.interface.type.directEntity'))"
		>
			<div class="q-pa-sm">
				<interface-entity-player v-model="data.direct_entity" />
			</div>
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			:label="$capitalize($t('builtin.advancement.interface.type.sourceEntity'))"
		>
			<div class="q-pa-sm">
				<interface-entity-player v-model="data.source_entity" />
			</div>
		</q-expansion-item>
	</q-list>
	<q-card bordered square flat class="q-pa-sm column align-center q-mt-sm q-mb-sm">
		<div class="text-center">{{ $capitalize($t('builtin.advancement.interface.fluid.flags')) }}</div>
		<div class="row justify-evenly">
			<q-checkbox
				v-model="data.bypasses_armor"
				left-label
				:label="$capitalize($t('builtin.advancement.interface.type.bypassArmor'))"
			/>
			<q-checkbox
				v-model="data.bypasses_invulnerability"
				left-label
				:label="$capitalize($t('builtin.advancement.interface.type.bypassInvulnerability'))"
			/>
			<q-checkbox
				v-model="data.bypasses_magic"
				left-label
				:label="$capitalize($t('builtin.advancement.interface.type.bypassMagic'))"
			/>
			<q-checkbox
				v-model="data.is_explosion"
				left-label
				:label="$capitalize($t('builtin.advancement.interface.type.isExplosion'))"
			/>
			<q-checkbox
				v-model="data.is_fire"
				left-label
				:label="$capitalize($t('builtin.advancement.interface.type.isFire'))"
			/>
			<q-checkbox
				v-model="data.is_magic"
				left-label
				:label="$capitalize($t('builtin.advancement.interface.type.isMagic'))"
			/>
			<q-checkbox
				v-model="data.is_projectile"
				left-label
				:label="$capitalize($t('builtin.advancement.interface.type.isProjectile'))"
			/>
			<q-checkbox
				v-model="data.is_lightning"
				left-label
				:label="$capitalize($t('builtin.advancement.interface.type.isLightning'))"
			/>
		</div>
	</q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';
import InterfaceEntityPlayer from './entityPlayer.vue';
import { type } from '../../model';

export default defineComponent({
	name: 'InterfaceType',
	components: {
		InterfaceEntityPlayer
	},
	props: {
		modelValue: {
			type: Object as PropType<type | null>,
			required: false,
			default: {} as type
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<type>({
			direct_entity: props.modelValue?.direct_entity ?? undefined,
			source_entity: props.modelValue?.source_entity ?? undefined,
			bypasses_armor: props.modelValue?.bypasses_armor ?? false,
			bypasses_invulnerability: props.modelValue?.bypasses_invulnerability ?? false,
			is_explosion: props.modelValue?.is_explosion ?? false,
			bypasses_magic: props.modelValue?.bypasses_magic ?? false,
			is_fire: props.modelValue?.is_fire ?? false,
			is_magic: props.modelValue?.is_magic ?? false,
			is_projectile: props.modelValue?.is_projectile ?? false,
			is_lightning: props.modelValue?.is_lightning ?? false,
		} as type);

		onBeforeMount(() => {
			watch(data, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			data
		};
	}
});
</script>
