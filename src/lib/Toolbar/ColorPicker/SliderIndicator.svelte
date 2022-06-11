<script lang="ts">
	import { clamp } from "../util";
	export let pos: number;
</script>

<div class="w-4 h-4 mt-1 rounded-full bg-white z-10 absolute select-none shadow" style={`left: calc(${clamp(pos, 0.5, 95)}%);`} />

<!-- <style>
	div {
		position: absolute;
		width: 6px;
		height: 6px;
		background-color: white;
		border-radius: 5px;
		margin-top: 2px;

		pointer-events: none;
		z-index: 1;
	}
</style> -->
