<template>
	<div class="column items-center">
		<q-btn
			color="green-7" outline icon="add"
			style="width:40%"
			@click="() => addReward()"
		/>
		<template
			v-for="(_el, i) of rewards"
			:key="i"
		>
			<div class="line row justify-around q-ma-sm q-pa-md">
				<q-btn
					square unelevated color="red"
					icon="remove" size="1em" padding=".1em"
					@click="() => deleteReward(i)"
				/>
				<q-option-group
					v-model="rewards[i]"
					:options="rewardsOptions"
					type="checkbox"
					inline
				/>
			</div>
			<q-badge v-if="rewards.length - 1 > i" color="purple">AND</q-badge>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import { advancement, trigger } from '../../model';

export default defineComponent({
	name: 'TabRequirements',
	props: {
		advancements: {
			type: Object as PropType<advancement>,
			required: true
		},
		modelValue: {
			type: Array as PropType<string[][]>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const rewards = ref<string[][]>([]);
		const rewardsOptions = ref<{ label: string, value: string }[]>([]);
		
		const setRewards = (requirements: string[][]) => {
			for (const list of requirements) {
				const ret = [];
				for (const name of list)
					ret.push(name);
				rewards.value.push(ret);
			}
		};

		const setRewardsOptions = (list: Record<string, trigger>) => {
			for (const name in list)
				rewardsOptions.value.push({ label: name, value: name });
		};

		const addReward = () => rewards.value.push([]);

		const deleteReward = (i: number) => rewards.value.splice(i, 1);

		onBeforeMount(() => {
			setRewardsOptions(props.advancements.data.criteria);
			setRewards(props.modelValue);
			watch(rewards, (val) => emit('update:modelValue', val));
		});

		return {
			rewards,
			rewardsOptions,
			addReward,
			deleteReward
		};
	}
});
</script>

<style scoped>
.line {
	position: relative;
	width: 100%;
	border: 1px solid rgba(150, 150, 150, .5);
}
.line > button {
	position: absolute;
	right: 0;
	top: 0;
	width: 25px;
}
</style>
