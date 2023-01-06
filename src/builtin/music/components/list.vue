<template>
	<q-list>
		<template
			v-for="categorie in sort"
			:key="categorie.type"
		>
			<q-expansion-item v-if="categorie.els.length" :label="categorie.type">
				<q-item
					v-for="el in categorie.els"
					:key="el.id"
					v-ripple
					clickable
					:class="(el.id === selectEl) ? 'background': ''"
					@click="select(el)"
				>
					<q-item-section class="q-pl-sm">
						<q-item-label>{{ el.name }}</q-item-label>
					</q-item-section>
				</q-item>
			</q-expansion-item>
		</template>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import { category, sound } from '../interface';

interface sort {
	type: category,
	els: sound[]
}

export default defineComponent({
	name: 'List',
	props: {
		list: {
			type: Object as PropType<Record<string, sound>>,
			required: true
		}
	},
	emits: ['select'],
	setup (props, { emit }) {
		const sort = ref<sort[]>([
			{ type: 'none', els: [] },
			{ type: 'ambient', els: [] },
			{ type: 'block', els: [] },
			{ type: 'hostile', els: [] },
			{ type: 'master', els: [] },
			{ type: 'music', els: [] },
			{ type: 'neutral', els: [] },
			{ type: 'player', els: [] },
			{ type: 'record', els: [] },
			{ type: 'voice', els: [] },
			{ type: 'weather', els: [] }
		]);
		const selectEl = ref<number>(0);

		const select = (d: sound) => {
			selectEl.value = d.id;
			emit('select', d);
		};

		const getSort = (type: category) => {
			for (let i = 0; i < sort.value.length; i++) {
				if (sort.value[i].type === type)
					return i;
			}
			return -1;
		};

		const sortData = (data: Record<string, sound>) => {
			for (const el in sort.value)
				sort.value[el].els.length = 0;
			for (const id in data) {
				const i = getSort(data[id].category);
				sort.value[i].els.push(data[id]);
			}
		};

		onBeforeMount(() => {
			sortData(props.list);
			watch(() => props.list, (after) => {
				sortData(after);
			});
		});

		return {
			sort,
			selectEl,
			select
		};
	}
});
</script>

<style scoped>
.background {
	background-color: rgba(200, 200, 200, .2);
}
</style>
