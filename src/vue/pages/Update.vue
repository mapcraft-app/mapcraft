<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>

	<q-banner v-if="isUpdate" class="text-white bg-orange q-ma-sm">
		<div class="flex justify-center">
			<span>Ne fermer pas la fenêtre pendant la (les) mise(s) à jour</span>
		</div>
	</q-banner>

	<q-list>
		<q-expansion-item
			v-if="storeMap.updateData?.datapack"
			expand-separator
		>
			<template v-slot:header>
				<q-item-section avatar>
					<q-avatar icon="handyman" />
				</q-item-section>
				<q-item-section>
					{{ $t('update.data') }}
				</q-item-section>
				<q-item-section>
					<q-linear-progress
						v-if="stat.datapack < 100"
						:value="stat.datapack / 100"
						rounded
						color="yellow-9"
						size="md"
					/>
					<div v-else class="flex items-center justify-center">
						<svg class="animated-check" viewBox="0 0 24 24">
							<path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />
						</svg>
					</div>
				</q-item-section>
			</template>
			<q-card>
				<q-card-section v-html="render(storeMap.updateData.datapack.description)" />
			</q-card>
		</q-expansion-item>
		<q-expansion-item
			v-if="storeMap.updateData?.resourcepack"
			expand-separator
		>
			<template v-slot:header>
				<q-item-section avatar>
					<q-avatar icon="imagesmode" color="" />
				</q-item-section>
				<q-item-section>
					{{ $t('update.resource') }}
				</q-item-section>
				<q-item-section>
					<q-linear-progress
						v-if="stat.resourcepack < 100"
						:value="stat.resourcepack / 100"
						rounded
						color="yellow-9"
						size="md"
					/>
					<div v-else class="flex items-center justify-center">
						<svg class="animated-check" viewBox="0 0 24 24">
							<path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />
						</svg>
					</div>
				</q-item-section>
			</template>
			<q-card>
				<q-card-section v-html="render(storeMap.updateData.resourcepack.description)" />
			</q-card>
		</q-expansion-item>
		<q-expansion-item
			v-if="storeMap.updateData?.software"
			expand-separator
		>
			<template v-slot:header>
				<q-item-section avatar>
					<q-avatar>
						<q-img :src="$toPublic('/imgs/app/icon_small.png')" />
					</q-avatar>
				</q-item-section>
				<q-item-section>
					{{ $t('update.software') }}
				</q-item-section>
				<q-item-section>
					<q-linear-progress
						v-if="stat.software < 100"
						:value="stat.software/ 100"
						rounded
						color="yellow-9"
						size="md"
					/>
					<div v-else class="flex items-center justify-center">
						<svg class="animated-check" viewBox="0 0 24 24">
							<path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />
						</svg>
					</div>
				</q-item-section>
			</template>
			<q-card>
				<q-card-section v-html="render(storeMap.updateData.software.description)" />
			</q-card>
		</q-expansion-item>
	</q-list>

	<div class="row no-wrap justify-evenly items-center q-mt-md">
		<q-btn
			color="red"
			:label="$t('update.cancel')"
			:disable="isUpdate"
			@click="cancel"
		/>
		<q-btn
			color="green"
			:label="$t('update.start')"
			:loading="isUpdate"
			@click="update"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount, toRaw, ref } from 'vue';
import { useQuasar } from 'quasar';
import markdownIt from 'markdown-it';
import { globalStore } from 'src/store/global';
import { mapStore } from 'store/map';
import type { update } from 'electron/preload/checkUpdate';
import type { stat } from 'electron/preload/installUpdate';

type statType = 'datapack' | 'resourcepack' | 'software';

export default defineComponent({
	name: 'UpdatePage',
	setup () {
		const store = globalStore();
		const storeMap = mapStore();
		const $q = useQuasar();
		const md = markdownIt();
		let interval: NodeJS.Timer; // eslint-disable-line no-undef
		const isFinish: Map<statType, boolean> = new Map();

		const isUpdate = ref<boolean>(false);
		const stat = ref<stat>({ datapack: 0, resourcepack: 0, software: 0 });

		const cancel = () => window.ipc.send('window::close');
		const update = () => {
			if (isUpdate.value)
				return;
			isUpdate.value = true;
			window.update.install(window.env.directory, toRaw(storeMap.updateData) as update);
			interval = setInterval(() => {
				stat.value = window.update.getStat();
				for (const i in stat.value) {
					if (isFinish.has(i as statType) && stat.value[i as statType] >= 100)
						isFinish.set(i as statType, true);
				}
				if (![ ...isFinish.values()].some((e) => e === false)) {
					clearInterval(interval);
					setTimeout(() => window.ipc.send('window::close'), 3000);
				}
			}, 100);
		};
		const render = (d: string): string => md.render(d);

		onBeforeMount(() => {
			$q.dark.set(store.darkMode);
			if (storeMap.updateData?.datapack)
				isFinish.set('datapack', false);
			if (storeMap.updateData?.resourcepack)
				isFinish.set('resourcepack', false);
			if (storeMap.updateData?.software)
				isFinish.set('software', false);
		});

		onBeforeUnmount(() => {
			if (interval)
				clearInterval(interval);
		});

		return {
			storeMap,
			isUpdate,
			stat,
			cancel,
			update,
			render
		};
	}
});
</script>

<style scoped>
.animated-check {
	height: 2.4em;
}
.animated-check path {
	fill: none;
	stroke: #7ac142;
	stroke-width: 4;
	stroke-dasharray: 23;
	stroke-dashoffset: 23;
	animation: draw .5s ease-in-out forwards;
	stroke-linecap: round;
	stroke-linejoin: round
}

@keyframes draw {
	to {
		stroke-dashoffset: 0
	}
}
</style>
