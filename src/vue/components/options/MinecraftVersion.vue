<template>
	<q-select
		v-model="selected"
		use-input input-debounce="0"
		style="max-height: 50px"
		:options="list" @filter="filterVersion"
	>
		<template v-slot:no-option>
			<q-item>
				<q-item-section class="text-grey">
					{{ $q.lang.table.noResults }}
				</q-item-section>
			</q-item>
		</template>
	</q-select>
	<q-dialog
		v-model="alert"
		persistent
	>
		<q-card>
			<q-card-section>
				<div class="text-h6">{{ $t('components.options.minecraftVersion.title') }}</div>
			</q-card-section>
			<q-card-section class="q-pt-none">
				<q-banner class="bg-primary text-white text-center q-mb-md">
					{{ $t('components.options.minecraftVersion.version', { from: store.minecraftVersion, to: selected }) }}
				</q-banner>
				<span>
					{{ $t('components.options.minecraftVersion.text') }}
				</span>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn
					v-close-popup
					color="green-7"
					:label="$t('components.options.minecraftVersion.ok')"
					@click="isValidated()"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { minecraft } from 'mapcraft-api';
import { mapStore } from 'store/map';
import { minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';

export default defineComponent({
	name: 'OptionsMinecraftUser',
	setup () {
		const store = mapStore();

		const alert = ref<boolean>(false);
		const selected = ref<string | null>(store.minecraftVersion);
		const list = ref<string[]>(minecraft.minecraft());
		const filterVersion = (val: string, update: (..._args: any[]) => void) => {
			if (val === '')
				update(() => list.value = minecraft.minecraft());
			else {
				update(() => {
					const needle = val.toLowerCase();
					list.value = minecraft.minecraft().filter(v => v.toLowerCase().indexOf(needle) > -1);
				});
			}
		};
		const isValidated = () => {
			store.setMinecraftVersion(selected.value as minecraftVersion);;
		};

		onBeforeMount(() => {
			watch(selected, (val) => {
				if (!alert.value && val && val.localeCompare(store.minecraftVersion))
					alert.value = true;
			});
		});

		/*
		onBeforeMount(() => {
			watch(selected, (val) => {
				if (minecraft.semverCompare(val as minecraftVersion, store.minecraftVersion) < 0) {

				} else
					store.setMinecraftVersion(val as minecraftVersion);
			});
		});
		*/

		return {
			store,
			alert,
			selected,
			list,
			filterVersion,
			isValidated
		};
	}
});
</script>