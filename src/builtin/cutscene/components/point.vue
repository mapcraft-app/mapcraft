<template>
	<div class="table">
		<span class="five">{{ $props.modelValue.point }}</span>
		<q-input v-model.number="$props.modelValue.x" type="number" dense :rules="[val => check(val) || '']" />
		<q-input v-model.number="$props.modelValue.y" type="number" dense :rules="[val => check(val) || '']" />
		<q-input v-model.number="$props.modelValue.z" type="number" dense :rules="[val => check(val) || '']" />
		<q-input v-model.number="$props.modelValue.rx" type="number" dense :rules="[val => check(val) || '']" />
		<q-input v-model.number="$props.modelValue.ry" type="number" dense :rules="[val => check(val) || '']" />
		<div class="duration">
			<q-input
				v-model.number="$props.modelValue.duration" type="number"
				step="1" min="0"
				:disable="$props.disable"
				:rules="[val => check(val) && val >= 0 || '']" 
				dense class="q-mr-xs"
			>
				<template v-slot:append>
					<span>{{ $t('builtin.cutscene.content.table.s') }}</span>
				</template>
			</q-input>
		</div>
		<q-select
			v-model="$props.modelValue.transition"
			:disable="$props.disable"
			:options="['ease', 'ease-in', 'ease-in-out', 'ease-out', 'linear']"
			dense
		/>
		<div class="seven">
			<q-btn
				square unelevated color="red-7"
				icon="delete" class="button"
				@click="$emit('delete', $props.modelValue.point)"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { cutscenePointInterface } from '../interface';

export default defineComponent({
	name: 'Point',
	props: {
		modelValue: {
			type: Object as PropType<cutscenePointInterface>,
			required: true
		},
		disable: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue', 'delete'],
	setup () {
		return {
			check: (x: any): boolean => typeof(x) !== 'undefined' && x !== null && typeof(x) === 'number'
		};
	}
});
</script>

<style scoped>
.table {
	width: 100%;
	display: inline-flex;
	align-items: baseline;
	margin-bottom: .2em;
}
.table > .five {
	width: 5%;
}
.table > .seven {
	width: 7%;
}
.table > .duration {
	display: inline-flex;
	align-items: center;
	flex-wrap: nowrap;
}
.table > * {
	width: 12.57%;
	text-align: center;
	padding: 0 .5em;
	word-wrap: break-word;
}
</style>
