<script lang="ts">
	export let wrapper: HTMLElement;
	export let isOpen;
	export let isPopup;
	export let toRight;
</script>

<div class="flex flex-col py-3 w-full" bind:this={wrapper}>
	<slot />
</div>