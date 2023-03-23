<template>
	<div class="row justify-evenly q-pt-sm q-pb-sm q-ml-xl">
		<span class="text-h6 q-mr-md">{{ $props.modelValue.cutscene.name }}</span>
		<div class="text-h6 row items-center">
			<q-icon size="sm" name="schedule"/>
			<span >{{ printTime($props.modelValue.cutscene.duration) }}</span>
		</div>
		<div class="row no-wrap justify-between">
			<q-btn
				square unelevated color="light-blue-7"
				icon="play_arrow"
				@click="$emit('open', true)"
			>
				<q-tooltip :delay="500" class="bg-light-blue-7">
					{{ $capitalize($t('builtin.cutscene.content.menu.editStart')) }}
				</q-tooltip>
			</q-btn>
			<q-btn
				square unelevated color="red-7"
				icon="stop"
				@click="$emit('open', false)"
			>
				<q-tooltip :delay="500" class="bg-red-7">
					{{ $capitalize($t('builtin.cutscene.content.menu.editEnd')) }}
				</q-tooltip>
			</q-btn>
			<q-btn
				square unelevated color="secondary"
				icon="settings"
				@click="modal = true"
			>
				<q-tooltip :delay="500" class="bg-secondary">
					{{ $capitalize($t('builtin.cutscene.content.menu.option')) }}
				</q-tooltip>
			</q-btn>
			
			<q-dialog v-model="modal">
				<option-modal :model-value="$props.modelValue" />
			</q-dialog>
				
			<q-separator vertical size="2px" class="q-ml-xs q-mr-xs"/>
			<q-btn
				square unelevated color="green-7"
				icon="save"
				@click="$emit('save', false)"
			>
				<q-tooltip :delay="500" class="bg-green-7">
					{{ $capitalize($t('builtin.cutscene.content.menu.save.start')) }}
				</q-tooltip>
			</q-btn>
			<q-btn
				square unelevated color="orange-7"
				icon="videocam"
				:disable="!!($props.modelValue.points && $props.modelValue.points.length <= 1)"
				@click="$emit('generate')"
			>
				<q-tooltip :delay="500" class="bg-orange-7">
					{{ $capitalize($t('builtin.cutscene.content.menu.generate.start')) }}
				</q-tooltip>
			</q-btn>
		</div>
	</div>
	<div class="table table-header">
		<span class="text-h6 five"></span>
		<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.x')) }}</span>
		<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.y')) }}</span>
		<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.z')) }}</span>
		<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.rx')) }}</span>
		<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.ry')) }}</span>
		<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.duration')) }}</span>
		<span class="text-h6">{{ $capitalize($t('builtin.cutscene.content.header.transition')) }}</span>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { cutscene } from '../interface';
import OptionModal from './optionModal.vue';

export default defineComponent({
	name: 'Options',
	components: {
		OptionModal
	},
	props: {
		modelValue: {
			type: Object as PropType<cutscene>,
			required: true
		}
	},
	emits: ['update:modelValue', 'open', 'save', 'generate'],
	setup () {
		const modal = ref<boolean>(false);

		const printTime = (seconds: number) => {
			const print = (x: number) => (x < 10)
				? `0${x}`
				: x;
			let hours = 0, minutes = 0;

			if (seconds >= 3600) {
				hours = Math.round(seconds / 3600);
				seconds %= 3600;
			}
			if (seconds >= 60) {
				minutes = Math.round(seconds / 60);
				seconds %= 60;
			}
			seconds = Math.round(seconds);
			return `${print(hours)}:${print(minutes)}:${print(seconds)}`;
		};

		return {
			modal,
			printTime
		};
	}
});
</script>

<style scoped>
.table {
	width: 100%;
	display: inline-flex;
	align-items: baseline;
	margin-bottom: .2em;
}
.table-header {
	position: sticky;
}
.table > .duration {
	display: inline-flex;
	align-items: center;
	flex-wrap: nowrap;
}
.table > .five {
	width: 5%;
}
.table > .seven {
	width: 7%;
}
.table > * {
	width: 12.57%;
	text-align: center;
	padding: 0 .5em;
	word-wrap: break-word;
}
</style>
