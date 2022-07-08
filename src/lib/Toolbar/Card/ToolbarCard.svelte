<script lang="ts">
    import clickOutside from "svelte-outside-click";
    import { fly } from "svelte/transition";
    import { activeCard,handleClickOutsideCard } from "./CardState";
    import type { CardType } from "./CardTypes";

    export let cardType: CardType;
    export let snapBottom = false;
    export let snapTop = false;
</script>

<div use:clickOutside={() => handleClickOutsideCard(cardType)}>
    {#if $activeCard === cardType}
        <div transition:fly={{ duration: 150, y: 5 }} class:top-0={snapTop} class:bottom-0={snapBottom} class="absolute left-16 z-50 bg-[#171717] shadow-black/30 shadow-lg w-96 p-4 rounded-2xl">
            <slot name="content" />
        </div>
    {/if}
    <slot />
</div>
