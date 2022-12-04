<script lang="ts">
    import Button from "../Common/Button.svelte";
    import Input from "../Common/Input.svelte";
    import { isHome } from "../stores/navigation";
    import { username } from "../stores/userSettings";
    import appIconSVG from '../../assets/Icon.svg';

    let isJoining = new URLSearchParams(window.location.search).get("room") !== null;

    function onCreateNewSketch() {
        window.history.pushState("", "", "/");
        $isHome = false;
    }
</script>

<div class="p-16 space-y-6">
    <div class="flex gap-6 items-center">
        <div class="w-12 h-12"><img src={appIconSVG} alt="moonbow icon"></div>
        <h1 class="text-gray-300 font-bold text-4xl">Moonbow</h1>
    </div>

    <div class="space-y-3">
        <Input bind:value={$username} placeholder="Username"/>
        {#if isJoining}
            <div class="flex space-x-3">
                <Button on:click={() => ($isHome = false)}>Join Sketch</Button>
                <Button color="transparent" on:click={onCreateNewSketch}>Create a new Sketch</Button>
            </div>
        {:else}
            <Button on:click={() => ($isHome = false)}>Create Sketch</Button>
        {/if}
    </div>
</div>
