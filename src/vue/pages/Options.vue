<template>
	<q-page>
		<q-splitter v-model="splitter" class="page">
			<template v-slot:before>
				<q-tabs
					v-model="tab"
					vertical
					class="text-teal"
				>
					<q-tab name="general" icon="settings" :label="$t('pages.options.general')" />
					<q-tab name="account" icon="account_circle" :label="$t('pages.options.user')" />
					<q-tab name="info" icon="info" :label="$t('pages.options.info')" />
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
							<span class="text-h4">{{ $t('pages.options.general') }}</span>
						</div>
						<div class="column justify-around">
							<div>
								<span class="text-h6">{{ $t('pages.options.lang') }}</span>
								<lang :is-large="true" />
							</div>
							<div class="q-mt-md">
								<options-directory/>
							</div>
						</div>
					</q-tab-panel>
					<q-tab-panel name="account">
						<div class="flex justify-center">
							<span class="text-h4">{{ $t('pages.options.user') }}</span>
						</div>
						<options-minecraft-user />
					</q-tab-panel>
					<q-tab-panel name="info">
						<div class="flex justify-center">
							<span class="text-h4">{{ $t('pages.options.info') }}</span>
						</div>
						<options-info />
					</q-tab-panel>
				</q-tab-panels>
			</template>
		</q-splitter>
	</q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import optionsDirectory from 'components/options/Directory.vue';
import optionsInfo from 'components/options/Info.vue';
import optionsMinecraftUser from 'components/options/MinecraftUser.vue';
import Lang from 'components/menu/Lang.vue';

export default defineComponent({
	components: {
		optionsDirectory,
		optionsInfo,
		optionsMinecraftUser,
		Lang
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

<style scoped>
.page {
	min-height: inherit;
}
</style>
