<script setup>
import { ref, defineProps, reactive, computed, onMounted } from 'vue';

const props = defineProps(['value']);
const length = ref(0);
const perc = ref(282);
const path = ref(null);
const to = computed(() =>
	Math.max(0, length.value * ((100 - props.value) / 100))
);

onMounted(() => {
	length.value = path.value.getTotalLength();
	setTimeout(() => {
		perc.value = parseInt(to);
	}, 100);
});
</script>

<template>
	<div class="compCirclebar">
		<svg
			class="compCirclebar__svg"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
		>
			<circle r="45" cx="50" cy="50" />
			<path
				ref="path"
				class="meter"
				:style="value < 70 ? 'stroke: #F43834;' : 'stroke: #3680FA;'"
				d="M5,50a45,45 0 1,0 90,0a45,45 0 1,0 -90,0"
				stroke-linecap="round"
				stroke-linejoin="round"
				:stroke-dashoffset="282 * ((100 - value) / 100)"
				stroke-dasharray="282.78302001953125"
			/>
			<text
				x="50"
				y="50"
				text-anchor="middle"
				dominant-baseline="central"
				font-size="20"
				style="font-size: medium; letter-spacing: -2%; line-height: 22px"
			>
				<tspan :style="value < 70 ? 'fill: red;' : 'fill: #3680FA;'">
					{{ value }}
				</tspan>
				<tspan class="chart-line">/</tspan>
				<tspan>100</tspan>
			</text>
		</svg>
	</div>
</template>

<style scoped>
.compCirclebar {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 18px;
}

.compCirclebar__svg {
	display: inline-flex;
	vertical-align: bottom;
	width: 152px;
	height: 152px;
}
circle {
	stroke: #f5f5f5;
	stroke-width: 6px;
	stroke-dasharray: 0;
	fill: none;
}

.chart-line {
	fill: #8f8f8f;
}

.meter {
	stroke-width: 8px;
	fill: none;
	transition: stroke-dashoffset 1s cubic-bezier(0.43, 0.41, 0.22, 0.91);
	transform-origin: center center;
	transform: rotate(-90deg) scaleX(-1);
}

text {
	fill: #000;
	font-weight: 500;
}
</style>
