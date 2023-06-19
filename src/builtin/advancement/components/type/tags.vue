<template>
	<div class="column items-start width">
		<q-btn
			icon="add" color="green-7" outline
			class="max-width"
			@click="addTag"
		/>
		<div
			v-for="(_el, i) in tags"
			:key="i"
			class="row no-wrap full-width justify-between"
		>
			<q-input
				v-model.number="tags[i].id"
				dense
				:label="$capitalize($t('builtin.advancement.tab.tags.id'))"
			/>
			<q-toggle
				v-model="tags[i].expected"
				:label="$capitalize($t('builtin.advancement.tab.tags.expected'))"
			/>
			<q-btn flat color="red" icon="delete" @click="removeTag(i)"/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onBeforeMount } from 'vue';
import { tags } from '../../model';

export default defineComponent({
	name: 'TypeTags',
	props: {
		modelValue: {
			type: Object as PropType<tags[] | null>,
			required: false,
			default: null
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const tags = ref<tags[]>([]);

		if (props.modelValue)
			tags.value = [ ...props.modelValue];
		const addTag = () => tags.value.push({ id: '', expected: false });
		const removeTag = (i: number) => tags.value.splice(i, 1);
		
		onBeforeMount(() => {
			watch(tags, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			tags,
			addTag,
			removeTag
		};
	}
});
</script>

<style scoped>
.width {
	width: 390px;
}
.max-width {
	width: 100%;
}
</style>
