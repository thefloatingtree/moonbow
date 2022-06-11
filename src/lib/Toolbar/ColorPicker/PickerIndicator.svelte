<script lang="ts">
	import { clamp } from "../util";

	export let pos: { x: number; y: number };
	export let color;
</script>

<div class=" absolute w-5 h-5 -ml-2 -mt-2 rounded-full border-white border-2 shadow-md select-none" style={`left: calc(${clamp(pos.x, 2.5, 96)}%); top: calc(${clamp(pos.y, 2.5, 96)}%); background-color: ${color.hex};`} />

<!-- 
<style>
	div {
		position: absolute;
		width: 15px;
		height: 15px;
		background-color: white;
		border-radius: 5px;

		pointer-events: none;
		z-index: 1;
	}
</style> -->
