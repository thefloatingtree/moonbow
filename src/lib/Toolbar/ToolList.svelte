<script lang="ts">
    import FaPaintBrush from "svelte-icons/fa/FaPaintBrush.svelte";
    import FaEraser from "svelte-icons/fa/FaEraser.svelte";
    import FaLocationArrow from "svelte-icons/fa/FaLocationArrow.svelte";
    import FaHandPaper from "svelte-icons/fa/FaHandPaper.svelte";
    import FaSearch from "svelte-icons/fa/FaSearch.svelte";
    import FaCompass from "svelte-icons/fa/FaCompass.svelte";
    import Tool from "./ToolbarIcon.svelte";
    import { onMount } from "svelte";
    import { app } from "../../drawing/App";
    import { ToolType } from "../../drawing/Tools/ToolTypes";

    let selectedTool: ToolType = null;

    function handleToolClick(type: ToolType) {
        if (selectedTool === type) {
            console.log("Open card!");
        }

        selectedTool = type;
        app.toolManager.selectTool(selectedTool);
    }

    onMount(() => {
        app.onAfterInit(() => {
            selectedTool = app.toolManager.selectedTool();

            app.toolManager.onSelectTool((toolType) => {
                selectedTool = toolType;
            });
        });
    });
</script>

<div>
    <Tool><div class="rounded-full bg-blue-600 w-7 h-7" /></Tool>
    <Tool on:click={() => handleToolClick(ToolType.Brush)} active={selectedTool === ToolType.Brush}><FaPaintBrush /></Tool>
    <Tool on:click={() => handleToolClick(ToolType.Eraser)} active={selectedTool === ToolType.Eraser}><FaEraser /></Tool>
    <Tool on:click={() => handleToolClick(ToolType.Select)} active={selectedTool === ToolType.Select}><FaLocationArrow /></Tool>
    <Tool on:click={() => handleToolClick(ToolType.Pan)} active={selectedTool === ToolType.Pan}><FaHandPaper /></Tool>
    <Tool on:click={() => handleToolClick(ToolType.Zoom)} active={selectedTool === ToolType.Zoom}><FaSearch /></Tool>
    <Tool on:click={() => handleToolClick(ToolType.Rotate)} active={selectedTool === ToolType.Rotate}><FaCompass /></Tool>
</div>
