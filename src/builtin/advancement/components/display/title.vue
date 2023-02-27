<template>
	<div class="row justify-center">
		<span class="text-h6 text-weight-light">
			{{ title }}
		</span>
	</div>
	<div
		class="row justify-center q-mb-xs"
		:style="`min-height: 34px; border: solid 1px ${($q.dark.isActive ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)')}`"
	>
		<span class="text-h6 text-weight-light" :style="textFormat">
			{{ innerText }}
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
import { computed, defineComponent, PropType, onBeforeMount, onUnmounted, reactive, ref, watch } from 'vue';
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
		const obfuscatedString = reactive<{ str: string, len: number }>({ str: '', len: props.modelValue.text.length });
		const obfuscatedTime: NodeJS.Timer = setInterval(() => { // eslint-disable-line no-undef
			let ret = '';
			const chars = '1234567890abcdefghijklmnopqrstuvwxyz~!@#$%^&*()-=_+{}[]';
			for (let i = 0; i < obfuscatedString.len; i++)
				ret += chars.charAt(Math.floor(Math.random() * chars.length));
			obfuscatedString.str = ret;
		}, 65);

		const colorsOptions = ref<textColor[]>(colors);
		const textFormat = computed(() => {
			let styleList: string[] = [`color: #${selectedColor.value.color}`];
			if (props.modelValue.bold)
				styleList.push('font-weight: bold');
			if (props.modelValue.italic)
				styleList.push('font-style: italic');
			if (props.modelValue.strikethrough && props.modelValue.underlined)
				styleList.push('text-decoration: line-through underline');
			else if (props.modelValue.strikethrough)
				styleList.push('text-decoration: line-through');
			else if (props.modelValue.underlined)
				styleList.push('text-decoration: underline');
			return styleList.join(';');
		});
		const innerText = computed(() => {
			return props.modelValue.obfuscated
				? obfuscatedString.str
				: props.modelValue.text;
		});

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
			watch(props.modelValue, (val) => {
				if (val.color)
					selectedColor.value = hexaColors.find((e) => e.value === val.color) ?? hexaColors[hexaColors.length - 1];
				obfuscatedString.len = val.text.length;
				emit('update:modelValue', val);
			}, { deep: true });
		});

		onUnmounted(() => clearInterval(obfuscatedTime));

		return {
			colorsOptions,
			textFormat,
			innerText,

			filterFn
		};
	}
});
</script>
