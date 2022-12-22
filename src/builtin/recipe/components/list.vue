<template>
	<q-list>
		<q-expansion-item expand-separator caption="one">
			<q-list dense>
				<q-item v-ripple clickable>
					<q-item-section>One</q-item-section>
				</q-item>
				<q-item v-ripple clickable>
					<q-item-section>Two</q-item-section>
				</q-item>
				<q-item v-ripple clickable>
					<q-item-section>Three</q-item-section>
				</q-item>
			</q-list>
		</q-expansion-item>
		<q-expansion-item expand-separator caption="two">
			<q-list dense>
				<q-item v-ripple clickable>
					<q-item-section>One</q-item-section>
				</q-item>
				<q-item v-ripple clickable>
					<q-item-section>Two</q-item-section>
				</q-item>
				<q-item v-ripple clickable>
					<q-item-section>Three</q-item-section>
				</q-item>
			</q-list>
		</q-expansion-item>
		<q-expansion-item expand-separator caption="three">
			<q-list dense>
				<q-item v-ripple clickable>
					<q-item-section>One</q-item-section>
				</q-item>
				<q-item v-ripple clickable>
					<q-item-section>Two</q-item-section>
				</q-item>
				<q-item v-ripple clickable>
					<q-item-section>Three</q-item-section>
				</q-item>
			</q-list>
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'List',
	setup () {
		return {};
	}
});
</script>
