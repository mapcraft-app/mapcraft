<template>
	<div>
		<q-input
			v-model="path"
			standard
			:label="$capitalize($t('builtin.advancement.tab.background'))"
		>
			<template v-slot:append>
				<q-btn flat round color="secondary" icon="folder" @click="changePath()" />
			</template>
		</q-input>
		<template v-if="minecraft.semverCompare(store.minecraftVersion, '1.20') >= 0">
			<q-toggle
				v-model="telemetry"
				:label="$capitalize($t('builtin.advancement.tab.telemetry'))"
			>
				<q-tooltip class="bg-purple text-body2" :offset="[10, 10]">
					{{ $capitalize($t('builtin.advancement.tab.telemetryExplanation')) }}
				</q-tooltip>
			</q-toggle>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { minecraft } from 'mapcraft-api/frontend';
import { mapStore } from '@/store/map';
import { advancementsList, indexAdv } from '../../store';

export default defineComponent({
	setup () {
		const store = mapStore();

		const path = ref<string>(
			advancementsList.value[indexAdv.value].data.background
			?? 'minecraft:textures/gui/advancements/backgrounds/stone.png'
		);
		const telemetry = ref<boolean>(
			advancementsList.value[indexAdv.value].data.telemetry
			?? false
		);

		const changePath = () => {
			const generatePathToFile = () => {
				const reg = /^(.*):(.*)$/m.exec(path.value);
				if (!reg)
					return undefined;
				return window.mapcraft.module.path.resolve(store.path.resourcepack, 'assets', reg[1], reg[2]);
			};

			window.ipc.invoke('dialog::select-file', generatePathToFile()).then((data) => {
				if (data.canceled)
					return;
				const split = window.mapcraft.module.path.normalize(data.filePaths[0].replace(window.mapcraft.module.path.resolve(store.path.resourcepack, 'assets'), '')).split(/\/|\\{1,2}/).filter((e) => e.length);
				path.value = `${split[0]}:${split.splice(1).join('/')}`;
			});
		};

		onBeforeMount(() => {
			watch(path, (val) => advancementsList.value[indexAdv.value].data.background = val);
			watch(telemetry, (val) => advancementsList.value[indexAdv.value].data.telemetry = val);
		});

		return {
			minecraft,
			store,
			path,
			telemetry,
			changePath
		};
	}
});
</script>
@/app/store/map
