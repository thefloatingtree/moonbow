<script lang="ts">
    import { onMount } from "svelte";
    import convert from "svelte-awesome-color-picker/util/convert";
    import FaCompass from "svelte-icons/fa/FaCompass.svelte";
    import FaEraser from "svelte-icons/fa/FaEraser.svelte";
    import FaEyeDropper from "svelte-icons/fa/FaEyeDropper.svelte";
    import FaHandPaper from "svelte-icons/fa/FaHandPaper.svelte";
    import FaPaintBrush from "svelte-icons/fa/FaPaintBrush.svelte";
    import FaSearch from "svelte-icons/fa/FaSearch.svelte";
    import { app } from "../../drawing/App";
    import { ToolType } from "../../drawing/Interactions/Tools/ToolTypes";
    import Switch from "../Common/Switch.svelte";
    import { brushColor,brushHardness,brushSize,brushUseOpacityPressure,brushUseSizePressure } from "../stores/brushSettings";
    import { eraserHardness,eraserSize,eraserUseOpacityPressure,eraserUseSizePressure } from "../stores/eraserSettings";
    import TipList from "./Card/Brush/TipList.svelte";
    import { toggleCard } from "./Card/CardState";
    import { CardType } from "./Card/CardTypes";
    import SizeSlider from "./Card/Slider.svelte";
    import ToolbarCard from "./Card/ToolbarCard.svelte";
    import ColorPicker from "./ColorPicker/ColorPicker.svelte";
import ToolbarIcon from "./ToolbarIcon.svelte";
    import Tool from "./ToolbarIcon.svelte";
    import FaUndo from 'svelte-icons/fa/FaUndo.svelte'
    import FaRedo from 'svelte-icons/fa/FaRedo.svelte'

    let selectedTool: ToolType = null;
    let colorBorderWidth: string = "0px";

    function handleToolClick(toolType: ToolType, cardType: CardType = null) {
        if (selectedTool === toolType) {
            if (cardType !== null) toggleCard(cardType);
        }

        selectedTool = toolType;
        app.artistManager.localArtist.changeTool(toolType);
    }

    onMount(() => {
        app.onAfterInit(() => {
            selectedTool = app.artistManager.localArtist.toolManager.selectedTool();

            app.artistManager.localArtist.toolManager.onSelectTool((toolType) => {
                selectedTool = toolType;
            });
        });
    });

    $: {
        if ($brushColor) {
            const value = convert.hex2Color({ hex: $brushColor })["v"];
            colorBorderWidth = value <= 0.5 ? "0.15rem" : "0rem";
        }
    }
</script>

<div>
    <ToolbarCard cardType={CardType.Color} snapTop>
        <Tool on:click={() => toggleCard(CardType.Color)}>
            <div style:background-color={$brushColor} style:outline-width={colorBorderWidth} class="rounded-full w-7 h-7 outline outline-white outline-4" />
        </Tool>
        <div slot="content">
            <div class="text-white select-none font-semibold">Colors</div>
            <ColorPicker />
        </div>
    </ToolbarCard>
    <!-- <Tool on:click={() => handleToolClick(ToolType.Select)} active={selectedTool === ToolType.Select}><FaLocationArrow /></Tool> -->
    <ToolbarCard cardType={CardType.Brush}>
        <Tool on:click={() => handleToolClick(ToolType.Brush, CardType.Brush)} active={selectedTool === ToolType.Brush}>
            <FaPaintBrush />
        </Tool>
        <div class="space-y-3" slot="content">
            <div class="text-white select-none font-semibold">Brush</div>
            <!-- <TipList /> -->
            <div class="space-y-1">
                <div class="text-gray-400">Size</div>
                <SizeSlider bind:value={$brushSize} min={1} max={100} />
            </div>
            <div class="space-y-1">
                <div class="text-gray-400">Softness</div>
                <SizeSlider bind:value={$brushHardness} min={2} max={20} />
            </div>
            <div class="flex items-center justify-between">
                <div class="text-gray-400">Control Size With Pressure</div>
                <Switch bind:active={$brushUseSizePressure} />
            </div>
            <div class="flex items-center justify-between">
                <div class="text-gray-400">Control Opacity With Pressure</div>
                <Switch bind:active={$brushUseOpacityPressure} />
            </div>
            <!-- <div class="space-y-1">
                <div class="text-gray-400">Spacing</div>
                <SizeSlider bind:value={$brushSpacing} />
            </div> -->
        </div>
    </ToolbarCard>
    <ToolbarCard cardType={CardType.Eraser}>
        <Tool on:click={() => handleToolClick(ToolType.Eraser, CardType.Eraser)} active={selectedTool === ToolType.Eraser}>
            <FaEraser />
        </Tool>
        <div class="space-y-3" slot="content">
            <div class="text-white select-none font-semibold">Eraser</div>
            <!-- <TipList /> -->
            <div class="space-y-1">
                <div class="text-gray-400">Size</div>
                <SizeSlider bind:value={$eraserSize} min={1} max={100} />
            </div>
            <div class="space-y-1">
                <div class="text-gray-400">Softness</div>
                <SizeSlider bind:value={$eraserHardness} min={2} max={20} />
            </div>
            <div class="flex items-center justify-between">
                <div class="text-gray-400">Control Size With Pressure</div>
                <Switch bind:active={$eraserUseSizePressure} />
            </div>
            <div class="flex items-center justify-between">
                <div class="text-gray-400">Control Opacity With Pressure</div>
                <Switch bind:active={$eraserUseOpacityPressure} />
            </div>
            <!-- <div class="space-y-1">
                <div class="text-gray-400">Spacing</div>
                <SizeSlider bind:value={$eraserSpacing} />
            </div> -->
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
    <ToolbarIcon on:click={() => app.artistManager.localArtist.undo()}>
        <FaUndo />
    </ToolbarIcon>
    <ToolbarIcon on:click={() => app.artistManager.localArtist.redo()}>
        <FaRedo />
    </ToolbarIcon>
</div>
