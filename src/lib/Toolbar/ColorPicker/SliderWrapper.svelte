<script lang="ts">
	export let focused: boolean;
</script>

<div class="w-full h-6 mt-3 rounded-full overflow-hidden" class:focused>
	<slot />
</div>
<!-- 
<style>
	div {
		width: var(--slider-width, 190px);
		height: var(--picker-height, 10px);
		border-radius: 7px;
		overflow: hidden;

		outline: 2px solid transparent;
		outline-offset: 3px;
		transition: outline 0.2s ease-in-out;
	}

	div.focused {
		outline: 2px solid var(--focus-color, red);
	}
</style> -->
