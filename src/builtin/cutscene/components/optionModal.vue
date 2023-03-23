<template>
	<q-card style="width: 700px; max-width: 80vw;">
		<q-card-section class="row justify-between">
			<div class="text-h6">{{ $capitalize($t('builtin.cutscene.option.title')) }}</div>
			<q-btn
				v-close-popup
				icon="close"
				flat round dense 
			/>
		</q-card-section>
		<q-card-section class="column q-pt-none">
			<span class="text-h6 q-pt-md">{{ $capitalize($t('builtin.cutscene.option.name')) }}</span>
			<q-input v-model="$props.modelValue.cutscene.name" />
			<span class="text-h6 q-pt-md">{{ $capitalize($t('builtin.cutscene.option.description')) }}</span>
			<q-input v-model="$props.modelValue.cutscene.description" />
			<span class="text-h6 q-pt-md">{{ $capitalize($t('builtin.cutscene.option.end.title')) }}</span>
			<q-list>
				<q-item v-ripple tag="label">
					<q-item-section avatar top>
						<q-radio v-model="$props.modelValue.option.end" val="origin" color="teal" />
					</q-item-section>
					<q-item-section>
						<q-item-label>{{ $capitalize($t('builtin.cutscene.option.end.origin.label')) }}</q-item-label>
						<q-item-label caption>{{ $capitalize($t('builtin.cutscene.option.end.origin.desc')) }}</q-item-label>
					</q-item-section>
				</q-item>
				<q-item v-ripple tag="label">
					<q-item-section avatar top>
						<q-radio v-model="$props.modelValue.option.end" val="last" color="orange" />
					</q-item-section>
					<q-item-section>
						<q-item-label>{{ $capitalize($t('builtin.cutscene.option.end.last.label')) }}</q-item-label>
						<q-item-label caption>{{ $capitalize($t('builtin.cutscene.option.end.last.desc')) }}</q-item-label>
					</q-item-section>
				</q-item>
				<q-item v-ripple tag="label">
					<q-item-section avatar top>
						<q-radio v-model="$props.modelValue.option.end" val="custom" color="cyan" />
					</q-item-section>
					<q-item-section>
						<q-item-label>{{ $capitalize($t('builtin.cutscene.option.end.custom.label')) }}</q-item-label>
						<q-item-label caption>{{ $capitalize($t('builtin.cutscene.option.end.custom.desc')) }}</q-item-label>
						<div v-if="$props.modelValue.option.end === 'custom'" class="row no-wrap">
							<q-input
								v-model.number="$props.modelValue.option.point.x" type="number"
								class="q-pr-xs"
								:label="$t('builtin.cutscene.content.header.x')"
							/>
							<q-input
								v-model.number="$props.modelValue.option.point.y" type="number"
								class="q-pl-xs q-pr-xs"
								:label="$t('builtin.cutscene.content.header.y')"
							/>
							<q-input
								v-model.number="$props.modelValue.option.point.z" type="number"
								class="q-pl-xs q-pr-xs"
								:label="$t('builtin.cutscene.content.header.z')"
							/>
							<q-input
								v-model.number="$props.modelValue.option.point.rx" type="number"
								class="q-pl-xs q-pr-xs"
								:label="$t('builtin.cutscene.content.header.rx')"
							/>
							<q-input
								v-model.number="$props.modelValue.option.point.ry" type="number"
								class="q-pl-xs"
								:label="$t('builtin.cutscene.content.header.ry')"
							/>
						</div>
					</q-item-section>
				</q-item>
			</q-list>
		</q-card-section>
	</q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { cutscene } from '../interface';

export default defineComponent({
	name: 'OptionModal',
	props: {
		modelValue: {
			type: Object as PropType<cutscene>,
			required: true
		}
	},
	emits: ['update:modelValue']
});
</script>
