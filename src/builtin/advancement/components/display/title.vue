<template>
	<div class="row justify-center bg-grey-2">
		<span class="text-h6 text-weight-light">
			{{ title }}
		</span>
	</div>
	<q-separator />
	<div class="row justify-center bg-grey-2 q-mb-xs">
		<span class="text-h6 text-weight-light" :style="`color: #${selectedColor.color}`">
			{{ strikeText }}
		</span>
	</div>
	<q-input
		v-model="$props.modelValue.text"
		class="q-pr-sm"
		dense
		label="Text"
	/>
	<q-select
		v-model="$props.modelValue.color"
		use-input
		input-debounce="0"
		label="Color"
		:options="colorsOptions"
		@filter="filterFn"
	>
		<template v-slot:no-option>
			<q-item>
				<q-item-section class="text-grey">
					No results
				</q-item-section>
			</q-item>
		</template>
	</q-select>
	<div class="row justify-center">
		<q-toggle
			v-model="$props.modelValue.bold"
			label="Bold"
		/>
		<q-toggle
			v-model="$props.modelValue.italic"
			label="Italic"
		/>
		<q-toggle
			v-model="$props.modelValue.obfuscated"
			label="Obfuscated"
		/>
		<q-toggle
			v-model="$props.modelValue.strikethrough"
			label="Strikethrough"
		/>
		<q-toggle
			v-model="$props.modelValue.underlined"
			label="Underlined"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, onUnmounted, ref, watch } from 'vue';
import { textColor, titleModel } from '../../model';

interface color {
	value: textColor;
	color: string;
}

export default defineComponent({
	name: 'DisplayTitle',
	props: {
		modelValue: {
			type: Object as PropType<titleModel>,
			required: true
		},
		title: {
			type: String,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const colors: textColor[] = [ 'aqua', 'black', 'blue', 'dark_aqua', 'dark_blue', 'dark_gray', 'dark_green', 'dark_purple', 'dark_red', 'gold', 'gray', 'green', 'light_purple', 'red', 'white', 'yellow' ];
		const hexaColors: color[] = [
			{ value: 'black', color: '000000' },
			{ value: 'dark_blue', color: '0000AA' },
			{ value: 'dark_green', color: '00AA00' },
			{ value: 'dark_aqua', color: '00AAAA' },
			{ value: 'dark_red', color: 'AA0000' },
			{ value: 'dark_purple', color: 'AA00AA' },
			{ value: 'gold', color: 'FFAA00' },
			{ value: 'gray', color: 'AAAAAA' },
			{ value: 'dark_gray', color: '555555' },
			{ value: 'blue', color: '5555FF' },
			{ value: 'green', color: '55FF55' },
			{ value: 'aqua', color: '55FFFF' },
			{ value: 'red', color: 'FF5555' },
			{ value: 'light_purple', color: 'FF55FF' },
			{ value: 'yellow', color: 'FFFF55' },
			{ value: 'white', color: 'FFFFFF' }
		];
		const selectedColor = ref<color>(hexaColors.find((e) => e.value === props.modelValue.color) ?? hexaColors[hexaColors.length - 1]);
		const colorsOptions = ref<textColor[]>(colors);
	
		const strikeText = ref<string>(props.modelValue.text);
		let strikeInterval: NodeJS.Timer | undefined; // eslint-disable-line no-undef

		const filterFn = (val: string, update: any) => {
			if (val === '') {
				update(() => colorsOptions.value = colors);
				return;
			}
			update(() => {
				const needle = val.toLowerCase();
				colorsOptions.value = colors.filter(v => v.toLowerCase().indexOf(needle) > -1);
			});
		};

		onBeforeMount(() => {
			strikeInterval = setInterval(() => {
				console.log(props.modelValue.strikethrough);
				if (props.modelValue.strikethrough) {
					let res = '';
					const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#!@';
					for (let i = 0; i < props.modelValue.text.length; i++)
						res += chars.charAt(Math.floor(Math.random() * chars.length));
					strikeText.value = res;
				} else
					strikeText.value = props.modelValue.text;
			}, 1000);
			watch(props.modelValue, (val) => {
				if (val.color)
					selectedColor.value = hexaColors.find((e) => e.value === val.color) ?? hexaColors[hexaColors.length - 1];
				emit('update:modelValue', val);
			}, { deep: true });
		});

		onUnmounted(() => {
			clearInterval(strikeInterval);
		});

		return {
			colorsOptions,
			selectedColor,
			
			strikeText,
			strikeInterval,
			
			filterFn,
		};
	}
});
</script>

<style scoped>
.bold {
	font-weight: bold;
}
.italic {
	font-style: italic;
}
.strikethrough {
	text-decoration: line-through;
}
.underlined {
	text-underline-position: under;
}
</style>
