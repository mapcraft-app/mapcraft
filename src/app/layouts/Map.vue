<template>
	<q-layout class="map-container" view="hHh lpR fFf" :container="true">
		<q-page-container class="layout-map-container">
			<router-view />
		</q-page-container>
		<q-footer class="bg-grey-8 text-white">
			<q-toolbar class="bg-grey-3 flex justify-evenly">
				<q-btn color="secondary" :label="$t('layouts.main.main.options')" @click="option?.show()"/>
				<q-dialog ref="option">
					<q-card class="layout-map-option-dialog" flat>
						<q-card-section class="row items-center q-pb-none">
							<div class="text-h6">{{ $t('layouts.main.main.options') }}</div>
							<q-space />
							<q-btn v-close-popup icon="close" flat round dense />
						</q-card-section>
						<q-card-section>
							<lang :is-large="true" class="q-mb-sm" />
							<q-space />
							<div class="flex items-center justify-between">
								<span class="text-h6">{{ $t('components.menu.darkMode.title') }}</span>
								<dark-mode/>
							</div>
							<directory/>
						</q-card-section>
					</q-card>
				</q-dialog>
			</q-toolbar>
		</q-footer>
	</q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DarkMode from '@/components/menu/DarkMode.vue';
import Directory from '@/components/options/Directory.vue';
import Lang from '@/components/menu/Lang.vue';
import { QDialog } from 'quasar';

export default defineComponent({
	name: 'MapLayout',
	components: {
		DarkMode,
		Directory,
		Lang
	},
	setup () {
		const option = ref<QDialog | null>(null);
		return {
			option
		};
	}
});
</script>

<style scoped>
	.layout-map-container {
		height: inherit;
	}
	.layout-map-option-dialog {
		width: 50%;
	}
</style>
