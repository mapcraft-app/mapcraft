<template>
	<div class="main">
		<div class="list">
			<q-list separator>
				<q-item v-ripple clickable>
					<q-item-section>Name</q-item-section>
				</q-item>
				<q-item v-ripple clickable>
					<q-item-section>Name</q-item-section>
				</q-item>
			</q-list>
		</div>
		<div class="tree">
			<div class="top">
				<q-input v-model="name" label="Name" class="input" />
				<div>
					<q-btn square color="green" icon="save" unelevated />
					<q-btn square color="orange" icon="settings" unelevated />
					<q-btn square color="red" icon="delete" unelevated />
				</div>
			</div>
			<div class="bottom">
				{{ item }}
			</div>
		</div>
	</div>
	<div class="q-pa-md">
		<interface-item v-model="item" />
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import InterfaceItem from './components/interface/item.vue';
import { item } from './model';

export default defineComponent({
	name: 'Advancement',
	components: {
		InterfaceItem
	},
	setup () {
		return {
			name: ref<string | null>(null),
			item: ref<item | null>(null)
		};
	}
});
</script>

<style scoped>
.main {
	height: 50vh;
	display: flex;
}
.list {
	width: 20vw;
	overflow: auto;
	border-right: 1px solid rgba(150, 150, 150, .5);
	border-bottom: 1px solid rgba(150, 150, 150, .5);
}
.tree {
	width: 80vw;
	border-bottom: 1px solid rgba(150, 150, 150, .5);
}
.top {
	display: inline-flex;
	flex-wrap: nowrap;
	align-items: center;
	width: inherit;
	justify-content: space-around;
	height: 4.5em;
}
.top > .input {
	width: 40%;
}
.bottom {
	height: calc(50vh - 4.5em);
	max-height: calc(50vh - 4.5em);
	overflow: auto;
}
</style>
