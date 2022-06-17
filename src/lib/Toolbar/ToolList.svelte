<script lang="ts">
    import FaPaintBrush from "svelte-icons/fa/FaPaintBrush.svelte";
    import FaEraser from "svelte-icons/fa/FaEraser.svelte";
    import FaLocationArrow from "svelte-icons/fa/FaLocationArrow.svelte";
    import FaHandPaper from "svelte-icons/fa/FaHandPaper.svelte";
    import FaSearch from "svelte-icons/fa/FaSearch.svelte";
    import FaCompass from "svelte-icons/fa/FaCompass.svelte";
    import FaEyeDropper from "svelte-icons/fa/FaEyeDropper.svelte";
    import Tool from "./ToolbarIcon.svelte";
    import { onMount } from "svelte";
    import { app } from "../../drawing/App";
    import { ToolType } from "../../drawing/Tools/ToolTypes";
    import ToolbarCard from "./Card/ToolbarCard.svelte";
    import { toggleCard } from "./Card/CardState";
    import { CardType } from "./Card/CardTypes";
    import ColorPicker from "./ColorPicker/ColorPicker.svelte";
    import { color } from "../stores/brushSettings";
    import convert from "svelte-awesome-color-picker/util/convert";
import SizeSlider from "./Card/Brush/SizeSlider.svelte";

    let selectedTool: ToolType = null;
    let colorBorderWidth: string = "0px";

    function handleToolClick(toolType: ToolType, cardType: CardType = null) {
        if (selectedTool === toolType) {
            if (cardType !== null) toggleCard(cardType);
        }

        console.log();

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

    $: {
        if ($color) {
            const value = convert.hex2Color({ hex: $color })["v"];
            colorBorderWidth = value <= 0.5 ? "0.15rem" : "0rem";
        }
    }
</script>

<div>
    <ToolbarCard cardType={CardType.Color} snapTop>
        <Tool on:click={() => toggleCard(CardType.Color)}>
            <div style:background-color={$color} style:outline-width={colorBorderWidth} class="rounded-full w-7 h-7 outline outline-white outline-4" />
        </Tool>
        <div slot="content">
            <div class="text-white select-none">Colors</div>
            <ColorPicker />
        </div>
    </ToolbarCard>
    <!-- <Tool on:click={() => handleToolClick(ToolType.Select)} active={selectedTool === ToolType.Select}><FaLocationArrow /></Tool> -->
    <ToolbarCard cardType={CardType.Brush}>
        <Tool on:click={() => handleToolClick(ToolType.Brush, CardType.Brush)} active={selectedTool === ToolType.Brush}>
            <FaPaintBrush />
        </Tool>
        <div slot="content">
            <div class="text-white select-none">Brush</div>
            <SizeSlider></SizeSlider>
        </div>
    </ToolbarCard>
    <ToolbarCard cardType={CardType.Eraser}>
        <Tool on:click={() => handleToolClick(ToolType.Eraser, CardType.Eraser)} active={selectedTool === ToolType.Eraser}>
            <FaEraser />
        </Tool>
        <div slot="content">
            <div class="text-white select-none">Eraser</div>
        </div>
    </ToolbarCard>
    <Tool on:click={() => handleToolClick(ToolType.Pan)} active={selectedTool === ToolType.Pan}>
        <FaHandPaper />
    </Tool>
    <Tool on:click={() => handleToolClick(ToolType.Zoom)} active={selectedTool === ToolType.Zoom}>
        <FaSearch />
    </Tool>
    <Tool on:click={() => handleToolClick(ToolType.Rotate)} active={selectedTool === ToolType.Rotate}>
        <FaCompass />
    </Tool>
    <Tool on:click={() => handleToolClick(ToolType.Eyedropper)} active={selectedTool === ToolType.Eyedropper}>
        <FaEyeDropper />
    </Tool>
</div>
