<template>
	<q-page>
		<div class="flex justify-center items-center">
			<q-card
				v-for="builtin in builtins" :key="builtin.path"
				class="card" square
				@click="handleClick({ name: builtin.name, path: builtin.path })"
			>
				<q-icon :name="builtin.icon" color="primary" size="4em"/>
				<span class="text-h6">
					{{ $capitalize($t(`builtin.${builtin.path}.menu.name`)) }}
				</span>
			</q-card>
		</div>
	</q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';
import { builtinList } from 'app/src/builtin/front';
import router from 'src/router';
import { globalStore } from 'store/global';

export default defineComponent({
	name: 'MainPage',
	setup () {
		const $q = useQuasar();
		const store = globalStore();

		const handleClick = (data: { name: string, path: string } | null = null) => {
			const route = (data)
				? `/${data.path}`
				: '/';
			if (data)
				store.plugin = data;
			$q.loading.show();
			router.push({ path: route }).finally(() => $q.loading.hide());
		};

		return {
			builtins: builtinList,
			handleClick
		};
	}
});
</script>

<style scoped>
.card {
	width: 100%;
  max-width: 200px;
	height: 200px;
	margin: 1em;
  padding: .5em;
  display: flex;
  flex-direction: column;
  align-items: center;
	justify-content: space-evenly;
	cursor: pointer;
	border-radius: 5px;
	transition: .3s;
}
.card:hover {
	transform: scale(1.03);
}
</style>
