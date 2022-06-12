<script lang="ts">
    import { onMount } from "svelte";
    import { app } from "./drawing/App";
    import { color, opacity, size } from "./lib/stores/brushSettings";
    import { colorPickerStore } from "./lib/stores/colorPicker";
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
