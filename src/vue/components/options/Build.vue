<template>
	<article>
		<p>Vous avez fini votre carte ? Il est donc temps de lancer la construction de votre carte</p>
		<p>Via cette fonction, toute votre carte sera générée, optimisée et archivée dans un seul fichier</p>
		<p>Cette étape peut prendre quelques minutes et peu faire geler la fenêtre de l'application. Néanmoins ne vous inquiétez pas et prenez votre mal en patience</p>
	</article>
	<div class="row justify-center align-center">
		<q-btn
			label="build"
			icon="handyman"
			color="light-green-8"
			class="button"
			:loading="isGenerate"
			@click="startGeneration"
		>
			<template v-slot:loading>
				<q-spinner-cube class="on-left" />
			</template>
		</q-btn>
		<div v-if="build || buildPath" class="row no-wrap align-center banner q-ma-md">
			<div style="width: 15%" class="row inline justify-center">
				<q-circular-progress
					:value="buildStatus * 12.6"
					:thickness="0.15"
					show-value
					size="4.5em"
					color="orange"
				>
					{{ buildStatus }}/8
				</q-circular-progress>
			</div>
			<span class="text-body2" style="width: 50%">{{ $capitalize($t(`components.options.build.${ret()}`)) }}</span>
			<q-btn
				v-if="buildStatus === 8 && buildPath"
				:label="$t('components.options.build.download')"
				icon="download"
				color="orange-7"
				style="width: 30%"
				@click="handleClick"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import type { Ref } from 'vue';

interface buildInject {
	build: Ref<boolean>,
	buildStatus: Ref<number>,
	buildPath: Ref<string | null>,
	buildStart: () => void
};

export default defineComponent({
	name: 'Build',
	setup () {
		const isGenerate = ref<boolean>(false);
		const { build, buildPath, buildStart, buildStatus } = inject('build') as buildInject;

		const startGeneration = () => {
			if (build.value)
				return;
			buildStart();
		};

		const ret = () => buildStatus.value > 0
			? buildStatus.value
			: 1;

		const handleClick = () => window.ipc.send('dialog::open-directory', buildPath.value);

		return {
			isGenerate,
			build,
			buildPath,
			buildStart,
			buildStatus,

			startGeneration,
			ret,
			handleClick
		};
	}
});
</script>

<style scoped>
.button {
	width: 75%;
}
.banner {
	width: 100%;
	align-items: center;
	justify-content: space-around;
}
</style>
