<script lang="ts">
    import ToolbarIcon from "./ToolbarIcon.svelte";
    import FaHome from "svelte-icons/fa/FaHome.svelte";
    import ToolbarCard from "./Card/ToolbarCard.svelte";
    import FaBars from "svelte-icons/fa/FaBars.svelte";
    import { toggleCard } from "./Card/CardState";
    import { CardType } from "./Card/CardTypes";
    import { artists } from "../stores/artists";
</script>

<div class="flex flex-col items-center space-y">
    <ToolbarCard cardType={CardType.Collaborators} snapBottom>
        <div on:click={() => toggleCard(CardType.Collaborators)} class="flex flex-col-reverse space-y-1 space-y-reverse hover:bg-[#4e4e4e] cursor-pointer rounded-full p-1 transition-all">
            {#each $artists as artist}
                <div class="w-8 aspect-square rounded-full flex items-center justify-center" style="background-color: {artist.color};">
                    <p class="font-medium text-lg">{artist.id[0]}</p>
                </div>
            {/each}
        </div>
        <div class="space-y-3" slot="content">
            <div class="text-white select-none">Collaborators</div>
            {#each $artists as artist}
                <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 aspect-square rounded-full flex items-center justify-center" style="background-color: {artist.color};"></div>
                    <div class="text-white">{artist.id}</div>
                </div>
            {/each}
        </div>
    </ToolbarCard>
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
</div>
