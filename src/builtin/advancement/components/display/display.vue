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
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, watch } from 'vue';
import DisplayTitle from './title.vue';
import { display } from '../../model';

export default defineComponent({
	name: 'DisplayMain',
	components: {
		DisplayTitle
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
