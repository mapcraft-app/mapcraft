<template>
	<q-list>
		<q-expansion-item
			v-for="(item, x) in list"
			:key="item.group"
			:caption="item.group"
			expand-separator
		>
			<q-list dense>
				<q-item
					v-for="el in item.el"
					:key="el.name"
					v-ripple
					clickable
					@click="openRecipe(x, el.name)"
				>
					<q-item-section>{{ el.name }}</q-item-section>
				</q-item>
			</q-list>
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { listInterface } from '../interface';

export default defineComponent({
	name: 'List',
	emits: ['select'],
	setup (_props, { emit }) {
		const list = ref<listInterface[]>([]);
		const get = (list: listInterface, name: string) => {
			for (const el of list.el) {
				if (el.name === name)
					return el;
			}
			return undefined;
		};

		const openRecipe = (x: number, name: string) => {
			const temp = get(list.value[x], name);
			if (temp)
				emit('select', temp);
		};

		onBeforeMount(() => {
			window.recipe.list()
				.then((files) => {
					list.value = files;
					console.log(files);
				})
				.catch((e) => console.error(e));
		});

		return {
			list,
			openRecipe
		};
	}
});
</script>
