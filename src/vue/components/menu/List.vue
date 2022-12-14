<template>
	<q-list>
		<q-item clickable @click="handleClick(); $router.push('/')">
			<q-item-section avatar class="menu-icon">
				<span class="material-icons" aria-hidden="true">{{ $t('components.list.home.icon') }}</span>
			</q-item-section>
			<q-item-section>
				{{ $capitalize($t('components.list.home.title')) }}
			</q-item-section>
		</q-item>
		<q-item
			v-for="builtin in builtins" :key="builtin.path"
			clickable
			@click="handleClick({name: builtin.name, path: builtin.path}); $router.push(`/${builtin.path}`)"
		>
			<q-item-section v-if="builtin.icon.length > 0" avatar class="menu-icon">
				<span class="material-icons" aria-hidden="true">{{ builtin.icon }}</span>
			</q-item-section>
			<q-item-section>
				{{ $capitalize($t(`builtin.${builtin.path}.menu.name`)) }}
			</q-item-section>
		</q-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { globalStore } from 'store/global';
import { builtinList } from 'builtin/front';

export default defineComponent({
	name: 'MenuList',
	setup () {
		const store = globalStore();

		const handleClick = (data: { name: string, path: string } | null = null) => {
			store.plugin = data;
		};

		return {
			builtins: builtinList,
			handleClick
		};
	}
});
</script>

<style scoped>
.menu-icon {
	font-size: 2em;
	text-align: center;
}
</style>
