<script lang="ts">
    import Button from "../Common/Button.svelte";
    import Input from "../Common/Input.svelte";
    import { isHome } from "../stores/navigation";
    import { username } from "../stores/userSettings";

    let isJoining = new URLSearchParams(window.location.search).get("room") !== null;

    function onCreateNewSketch() {
        window.history.pushState("", "", "/");
        $isHome = false;
    }
</script>

<div class="p-16 space-y-12">
    <h1 class="text-gray-300 font-bold text-4xl">Multiplayer Drawing App</h1>


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
