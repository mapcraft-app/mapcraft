<template>
	<q-input
		v-model="path"
		standard
		:label="$capitalize($t('builtin.advancement.tab.background'))"
	>
		<template v-slot:append>
			<q-btn flat round color="secondary" icon="folder" @click="changePath()" />
		</template>
	</q-input>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';
import { mapStore } from 'src/store/map';

export default defineComponent({
	props: {
		modelValue: {
			type: String as PropType<string | null>,
			required: false,
			default: null
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const store = mapStore();
		const path = ref<string>(props.modelValue ?? 'minecraft:textures/gui/advancements/backgrounds/stone.png');

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
			watch(path, (val) => emit('update:modelValue', val));
		});

		return {
			path,
			changePath
		};
	}
});
</script>
