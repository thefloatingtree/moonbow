<script lang="ts">
    import ToolbarIcon from "./ToolbarIcon.svelte";
    import ToolbarCard from "./Card/ToolbarCard.svelte";
    import FaBars from "svelte-icons/fa/FaBars.svelte";
    import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
    import { ignoreNextClickOutside, toggleCard, toggleCardWithinCard } from "./Card/CardState";
    import { CardType } from "./Card/CardTypes";
    import { artists } from "../stores/artists";
    import { app } from "../../drawing/App";

    let inviteButtonText = "Copy link to sketch"
    let timeout = null

    function onCopyInvite() {
        navigator.clipboard.writeText(app.connection.joinURL)
        inviteButtonText = "Copied!"
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            inviteButtonText = "Copy link to sketch"
        }, 2000)
    }
    
</script>

<div class="flex flex-col items-center space-y">
    <ToolbarCard cardType={CardType.Collaborators} snapBottom>
        <div on:click={() => toggleCard(CardType.Collaborators)} class="flex flex-col-reverse space-y-1 space-y-reverse hover:bg-[#4e4e4e] cursor-pointer rounded-full p-1 transition-all">
            {#each $artists as artist}
                <div class="w-8 aspect-square rounded-full flex items-center justify-center" style="background-color: {artist.color};">
                    <p class="font-medium text-lg select-none">{artist.name[0]}</p>
                </div>
            {/each}
        </div>
        <div class="space-y-3" slot="content">
            <div class="text-white select-none">Collaborators</div>
            {#each $artists as artist}
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-4 h-4 aspect-square rounded-full flex items-center justify-center" style="background-color: {artist.color};"></div>
                        <div class="text-white">{artist.name} {(artist.id === app.artistManager.localArtist.id) ? "(you)" : ""}</div>
                    </div>
                    <div class="text-white">{artist.owner ? "owner" : "collaborator"}</div>
                </div>
            {/each}
            <div on:click={onCopyInvite} class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all select-none">{inviteButtonText}</div>
        </div>
    </ToolbarCard>
    <ToolbarCard cardType={CardType.Home} snapBottom>
        <ToolbarIcon on:click={() => toggleCard(CardType.Home)}><FaBars /></ToolbarIcon>
        <div class="space-y-3" slot="content">
            <div class="text-white select-none">Untitled Sketch</div>
            <div class="space-y-1">
                <div on:click={() => toggleCardWithinCard(CardType.Collaborators)} class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">Collaborators</div>
                <div on:click={() => toggleCardWithinCard(CardType.Export)} class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">Export</div>
                <!-- <div class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">Canvas</div>
                <div class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">Preferences</div>
                <div class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">Help</div> -->
            </div>
        </div>
    </ToolbarCard>
    <ToolbarCard cardType={CardType.Export} snapBottom>
        <div class="space-y-3" slot="content">
            <div class="flex justify-between">
                <div class="text-white select-none">Export</div>
                <div on:click={() => toggleCardWithinCard(CardType.Home)} class="w-6 h-6 text-gray-500 hover:text-gray-400 cursor-pointer transition-all duration-75">
                    <FaArrowLeft />
                </div>
            </div>
            <div class="space-y-1">
                <div on:click={() => app.canvas.exportToPNG()} class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">PNG</div>
                <div on:click={() => app.canvas.exportToJPEG()} class="bg-[#2E2E2E] rounded-md py-2 px-3 text-gray-300 cursor-pointer hover:bg-[#4e4e4e] transition-all">JPEG</div>
            </div>
        </div>
    </ToolbarCard>
</div>