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
    import ToolbarCard from "./Card/ToolbarCard.svelte";
    import { toggleCard } from "./Card/CardState";
    import { CardType } from "./Card/CardTypes";

    let selectedTool: ToolType = null;

    function handleToolClick(toolType: ToolType, cardType: CardType = null) {
        if (selectedTool === toolType) {
            if (cardType !== null) toggleCard(cardType);
        }

        selectedTool = toolType;
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
    <!-- <ToolbarCard cardType={CardType.Color} snapTop>
        <Tool on:click={() => toggleCard(CardType.Color)}><div class="rounded-full bg-blue-600 w-7 h-7" /></Tool>
        <div slot="content">
            <div class="text-white select-none">Colors</div>
        </div>
    </ToolbarCard> -->
    <!-- <Tool on:click={() => handleToolClick(ToolType.Select)} active={selectedTool === ToolType.Select}><FaLocationArrow /></Tool> -->
    <ToolbarCard cardType={CardType.Brush}>
        <Tool on:click={() => handleToolClick(ToolType.Brush, CardType.Brush)} active={selectedTool === ToolType.Brush}><FaPaintBrush /></Tool>
        <div slot="content">
            <div class="text-white select-none">Brush</div>
        </div>
    </ToolbarCard>
    <ToolbarCard cardType={CardType.Eraser}>
        <Tool on:click={() => handleToolClick(ToolType.Eraser, CardType.Eraser)} active={selectedTool === ToolType.Eraser}><FaEraser /></Tool>
        <div slot="content">
            <div class="text-white select-none">Eraser</div>
        </div>
    </ToolbarCard>
    <Tool on:click={() => handleToolClick(ToolType.Pan)} active={selectedTool === ToolType.Pan}><FaHandPaper /></Tool>
    <Tool on:click={() => handleToolClick(ToolType.Zoom)} active={selectedTool === ToolType.Zoom}><FaSearch /></Tool>
    <Tool on:click={() => handleToolClick(ToolType.Rotate)} active={selectedTool === ToolType.Rotate}><FaCompass /></Tool>
</div>