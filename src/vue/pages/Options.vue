<template>
	<q-page>
		<q-splitter v-model="splitter">
			<template v-slot:before>
				<q-tabs
					v-model="tab"
					vertical
					class="text-teal"
				>
					<q-tab name="general" icon="settings" label="General" />
					<q-tab name="info" icon="info" label="Information" />
				</q-tabs>
			</template>
			<template v-slot:after>
				<q-tab-panels
					v-model="tab"
					animated
					swipeable
					vertical
					transition-prev="jump-up"
					transition-next="jump-down"
				>
					<q-tab-panel name="general">
						<div class="flex justify-center">
							<span class="text-h4">General</span>
						</div>
						<options-directory/>
					</q-tab-panel>
					<q-tab-panel name="info">
						<h1>Info</h1>
					</q-tab-panel>
				</q-tab-panels>
			</template>
		</q-splitter>
	</q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import optionsDirectory from 'components/options/Directory.vue';

export default defineComponent({
	components: {
		optionsDirectory
	},
	setup () {
		const splitter = ref<number>(15);
		const tab = ref<string>('general');

		return {
			splitter,
			tab
		};
	}
});
</script>

<style>
.input-group {
	border-left: #646464 1px solid;
  padding-left: 0.5em;
}
</style>
