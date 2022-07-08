<script lang="ts">
    import { onMount } from "svelte";
    import { app } from "./drawing/App";
    import Home from "./lib/Home/Home.svelte";
    import { isHome } from "./lib/stores/navigation";
    import Toolbar from "./lib/Toolbar/Toolbar.svelte";

    let canvasElement;

    $: {
        if (!$isHome) {
            app.init(canvasElement);
        }
    }


    onMount(() => {
        $isHome = true
    })

</script>

<main>
    {#if $isHome}
        <Home />
    {/if}
    <div class:invisible={$isHome}>
        <Toolbar />
        <canvas bind:this={canvasElement} />
    </div>
</main>

<style>
    main {
        background-color: #171717;
        height: 100vh;
        widows: 100vw;
    }
</style>
