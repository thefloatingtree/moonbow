<script lang="ts">
    import { onMount } from "svelte";
    import { app } from "./drawing/App";
    import Toolbar from "./lib/Toolbar/Toolbar.svelte";

    let canvasElement;

    onMount(() => {
        app.init(canvasElement);
    });
</script>

<main>
    <Toolbar />
    <canvas bind:this={canvasElement} />
</main>
