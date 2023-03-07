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
		v-model="data.text"
		class="q-pr-sm"
		dense
		:label="$capitalize($t('builtin.advancement.tab.display.text'))"
	/>
	<q-select
		v-model="selectedColor"
		use-input
		input-debounce="0"
		:label="$capitalize($t('builtin.advancement.tab.display.color'))"
		:options="colorsOptions"
		@filter="filterFn"
	>
		<template v-slot:no-option>
			<q-item>
				<q-item-section class="text-grey">
					{{ $capitalize($t('builtin.advancement.tab.display.noResult')) }}
				</q-item-section>
			</q-item>
		</template>
	</q-select>
	<div class="row justify-center">
		<q-toggle
			v-model="data.bold"
			:label="$capitalize($t('builtin.advancement.tab.display.bold'))"
		/>
		<q-toggle
			v-model="data.italic"
			:label="$capitalize($t('builtin.advancement.tab.display.italic'))"
		/>
		<q-toggle
			v-model="data.obfuscated"
			:label="$capitalize($t('builtin.advancement.tab.display.obfuscated'))"
		/>
		<q-toggle
			v-model="data.strikethrough"
			:label="$capitalize($t('builtin.advancement.tab.display.strikethrough'))"
		/>
		<q-toggle
			v-model="data.underlined"
			:label="$capitalize($t('builtin.advancement.tab.display.underlined'))"
		/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, onBeforeMount, onUnmounted, reactive, ref, watch } from 'vue';
import { textColor, titleModel } from '../../../model';
import { capitalize } from 'src/vue/plugins/app';
import { useI18n } from 'vue-i18n';

interface color {
	value: textColor;
	label: string,
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
		const { t } = useI18n();

		const data = ref<titleModel>(props.modelValue);

		const hexaColors: color[] = [
			{ value: 'black', label: capitalize(t('builtin.advancement.tab.display.colorList[0]')), color: '000000' },
			{ value: 'dark_blue', label: capitalize(t('builtin.advancement.tab.display.colorList[1]')), color: '0000AA' },
			{ value: 'dark_green', label: capitalize(t('builtin.advancement.tab.display.colorList[2]')), color: '00AA00' },
			{ value: 'dark_aqua', label: capitalize(t('builtin.advancement.tab.display.colorList[3]')), color: '00AAAA' },
			{ value: 'dark_red', label: capitalize(t('builtin.advancement.tab.display.colorList[4]')), color: 'AA0000' },
			{ value: 'dark_purple', label: capitalize(t('builtin.advancement.tab.display.colorList[5]')), color: 'AA00AA' },
			{ value: 'gold', label: capitalize(t('builtin.advancement.tab.display.colorList[6]')), color: 'FFAA00' },
			{ value: 'gray', label: capitalize(t('builtin.advancement.tab.display.colorList[7]')), color: 'AAAAAA' },
			{ value: 'dark_gray', label: capitalize(t('builtin.advancement.tab.display.colorList[8]')), color: '555555' },
			{ value: 'blue', label: capitalize(t('builtin.advancement.tab.display.colorList[9]')), color: '5555FF' },
			{ value: 'green', label: capitalize(t('builtin.advancement.tab.display.colorList[10]')), color: '55FF55' },
			{ value: 'aqua', label: capitalize(t('builtin.advancement.tab.display.colorList[11]')), color: '55FFFF' },
			{ value: 'red', label: capitalize(t('builtin.advancement.tab.display.colorList[12]')), color: 'FF5555' },
			{ value: 'light_purple', label: capitalize(t('builtin.advancement.tab.display.colorList[13]')), color: 'FF55FF' },
			{ value: 'yellow', label: capitalize(t('builtin.advancement.tab.display.colorList[14]')), color: 'FFFF55' },
			{ value: 'white', label: capitalize(t('builtin.advancement.tab.display.colorList[15]')), color: 'FFFFFF' }
		];
		const colorsOptions = ref<color[]>(hexaColors);
		const selectedColor = ref<color>(hexaColors.find((e) => e.value === data.value.color) ?? hexaColors[hexaColors.length - 1]);
		
		const obfuscatedString = reactive<{ str: string, len: number }>({ str: '', len: data.value.text.length });
		const obfuscatedTime: NodeJS.Timer = setInterval(() => { // eslint-disable-line no-undef
			let ret = '';
			const chars = '1234567890abcdefghijklmnopqrstuvwxyz~!@#$%^&*()-=_+{}[]';
			for (let i = 0; i < obfuscatedString.len; i++)
				ret += chars.charAt(Math.floor(Math.random() * chars.length));
			obfuscatedString.str = ret;
		}, 65);

		const textFormat = computed(() => {
			let styleList: string[] = [`color: #${selectedColor.value.color}`];
			if (data.value.bold)
				styleList.push('font-weight: bold');
			if (data.value.italic)
				styleList.push('font-style: italic');
			if (data.value.strikethrough && data.value.underlined)
				styleList.push('text-decoration: line-through underline');
			else if (data.value.strikethrough)
				styleList.push('text-decoration: line-through');
			else if (data.value.underlined)
				styleList.push('text-decoration: underline');
			return styleList.join(';');
		});
		const innerText = computed(() => {
			return data.value.obfuscated
				? obfuscatedString.str
				: data.value.text;
		});
		const filterFn = (val: string, update: any) => {
			if (val === '') {
				update(() => colorsOptions.value = hexaColors);
				return;
			}
			update(() => {
				const needle = val.toLowerCase();
				colorsOptions.value = hexaColors.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
			});
		};

		onBeforeMount(() => {
			watch(selectedColor, (val) => {
				data.value.color = val.value;
				emit('update:modelValue', data.value);
			}, { deep: true });

			watch(data, (val) => {
				val.color = data.value.color;
				obfuscatedString.len = val.text.length;
				emit('update:modelValue', val);
			}, { deep: true });

			watch(props.modelValue, (val) => data.value = val);
		});

		onUnmounted(() => clearInterval(obfuscatedTime));

		return {
			data,

			colorsOptions,
			selectedColor,

			obfuscatedString,
			obfuscatedTime,

			textFormat,
			innerText,
			filterFn
		};
	}
});
</script>
