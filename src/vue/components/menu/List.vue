<template>
	<q-list>
		<q-item clickable @click="$router.push('/')">
			<q-item-section avatar class="menu-icon">
				<span class="material-icons" aria-hidden="true">home</span>
			</q-item-section>
			<q-item-section>
				Main
			</q-item-section>
		</q-item>
		<q-item
			v-for="builtin in builtins" :key="builtin.path"
			clickable
			@click="$router.push(`/${builtin.path}`)"
		>
			<q-item-section v-if="builtin.icon.length > 0" avatar class="menu-icon">
				<span class="material-icons" aria-hidden="true">{{ builtin.icon }}</span>
			</q-item-section>
			<q-item-section>
				{{ $t(`builtin.${builtin.path}.menu.name`) }}
			</q-item-section>
		</q-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { builtinList } from 'app/src/builtin';

export default defineComponent({
	name: 'MenuList',
	setup () {
		return {
			builtins: builtinList
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
