<template>
	<div class="q-ma-md">
		<span class="text-h6 q-pb-sm">Stonecutter</span>
		<q-separator />
	</div>
	<div class="craft">
		<div class="craft_background">
			<div class="case"></div>
			<img class="craft_arrow" src="imgs/minecraft/arrow.png"/>
			<div class="craft_result">
				<div class="case"></div>
				<q-input
					v-model.number="count"
					input-class="input-reduce"
					square filled dense
					class="input" type="number" value="1"
					min="1" max="64" step="1"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
	name: 'Furnace',
	setup () {
		const count = ref<number>(0);
		return {
			count
		};
	}
});
</script>

<style scoped>
.input {
	position: absolute;
	width: 4em;
	margin-top: 4.5em;
}
.craft {
	display: flex;
	justify-content: center;
}
.craft_background {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	background-color: #c6c7c6;
	height: 250px;
	margin: 0 5em;
	max-width: 480px;
	min-width: 480px;
	border: 5px inset;
}
.case-disabled {
	background-color: #4e4e4e;
	width: 4em;
	height: 4em;
	margin: 0.15em;
	text-align: center;
}
.case {
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
.craft_arrow {
	width: 5em;
	height: 5em;
	image-rendering: -webkit-crisp-edges;
	image-rendering: -moz-crisp-edges;
	image-rendering: crisp-edges;
	image-rendering: pixelated;
	-ms-interpolation-mode: nearest-neighbor;
}
.craft_result {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
}
</style>
