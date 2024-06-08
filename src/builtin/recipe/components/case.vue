<template>
	<template v-if="data.id">
		<div class="case">
			<img
				:title="data.id"
				:src="genPath(data)"
				@click="select"
				@error="$imgErr"
			/>
			<q-btn
				square icon="close"
				color="secondary" class="close_button"
				@click="remove"
			/>
		</div>
	</template>
	<template v-else>
		<div class="case" @click="select"></div>
	</template>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { toPublic, path } from '@/app/plugins/app';
import type { caseData } from '../interface';

export default defineComponent({
	name: 'Case',
	props: {
		data: {
			type: Object as PropType<caseData>,
			default: {} as caseData,
			required: false
		}
	},
	emits: ['remove', 'select'],
	setup (_props, { emit }) {
		const remove = () => {
			emit('remove');
		};

		const select = () => {
			emit('select');
		};

		const genPath = (data: caseData) => {
			if (data.type === 'item') {
				return data.path
					? path(data.path)
					: toPublic('/imgs/minecraft/no_data.png');
			} else {
				return toPublic(
					data.path
						? `/imgs/minecraft/block/${data.id}.webp`
						: '/imgs/minecraft/no_data.png'
				);
			}
		};

		return {
			remove,
			select,
			genPath
		};
	}
});
</script>

<style scoped>
.close_button {
	position: absolute;
	z-index: 999;
	right: 0;
	width: fit-content;
	padding: 0;
	font-size: 10px;
}
.case-disabled {
	background-color: #4e4e4e;
	width: 4em;
	height: 4em;
	margin: 0.15em;
	text-align: center;
}
.case {
	position: relative;
	background-color: #8c8a8c;
	width: 4em;
	height: 4em;
	margin: 0.15em;
	text-align: center;
	cursor: pointer;
}
.case img {
	position: relative;
	max-width: 4em;
	max-height: 4em;
	transform: translateY(-50%);
	top: 50%;
}
.case:hover {
	background-color: rgba(24, 26, 27, 0.5);
}
</style>
