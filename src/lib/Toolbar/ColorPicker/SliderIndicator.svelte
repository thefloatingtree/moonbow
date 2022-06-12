<script lang="ts">
	import { clamp } from "../util";
	export let pos: number;

	export let toRight;
	export let color;
</script>

<div class="w-4 h-4 mt-1 rounded-full bg-white z-10 absolute select-none shadow" style={`left: calc(${clamp(pos, 0.5, 95)}%);`} />