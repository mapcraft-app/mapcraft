<template>
	<q-page>
		<div class="flex justify-center items-center">
			<q-card
				v-for="plugin in plugins" :key="plugin.path"
				class="card"
				square flat bordered
				@click="handleClick({ name: plugin.name, path: plugin.path })"
			>
				<q-icon :name="plugin.icon" color="primary" size="4em"/>
				<span class="text-h6">
					{{ $capitalize($t(`builtin.${plugin.path}.menu.name`)) }}
				</span>
			</q-card>
		</div>
	</q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';
import router from '@/router/index';
import path from '@/router/path';
import { builtinList } from '@/builtin/front';

export default defineComponent({
	name: 'MainPage',
	setup () {
		const $q = useQuasar();
		const plugins = [ ...builtinList ];
		
		const handleClick = (data: { name: string, path: string } | null = null) => {
			const route = path(data);
			$q.loading.show();
			router
				.push({ path: route })
				.finally(() => $q.loading.hide());
		};

		return {
			plugins,
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
