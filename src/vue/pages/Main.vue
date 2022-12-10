<template>
	<q-page>
		<div class="flex justify-center items-center">
			<q-card
				class="card" square
				@click="$router.push('/')">
				<q-icon :name="$t('components.list.home.icon')" color="primary" size="4em"/>
				<span class="text-h6">{{ $capitalize($t('components.list.home.title')) }}</span>
			</q-card>
			<q-card
				v-for="builtin in builtins" :key="builtin.path"
				class="card" square
				@click="$router.push(`/${builtin.path}`)">
				<q-icon :name="builtin.icon" color="primary" size="4em"/>
				<span class="text-h6">{{ $capitalize(builtin.name) }}</span>
			</q-card>
		</div>
	</q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { builtinList } from 'app/src/builtin/front';

export default defineComponent({
	name: 'MainPage',
	setup () {
		return {
			builtins: builtinList
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
