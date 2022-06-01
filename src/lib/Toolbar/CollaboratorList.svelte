<script lang="ts">
    import ToolbarIcon from "./ToolbarIcon.svelte";
    import FaHome from "svelte-icons/fa/FaHome.svelte";
    import ToolbarCard from "./Card/ToolbarCard.svelte";
    import FaBars from 'svelte-icons/fa/FaBars.svelte'
    import { toggleCard } from "./Card/CardState";
    import { CardType } from "./Card/CardTypes";
</script>

<ToolbarCard cardType={CardType.Home} snapBottom>
    <ToolbarIcon on:click={() => toggleCard(CardType.Home)}><FaBars /></ToolbarIcon>
    <div class="space-y-3" slot="content">
        <div class="text-white select-none">Untitled Sketch</div>
        <div class="space-y-1">
            <div class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">Export</div>
            <div class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">Canvas</div>
            <div class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">Preferences</div>
            <div class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">Help</div>
        </div>
    </div>
</ToolbarCard>
