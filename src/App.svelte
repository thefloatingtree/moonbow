<script lang="ts">
    import { onMount } from 'svelte'
    import { app } from './drawing/App'

    let canvasElement

    onMount(() => {
        app.init(canvasElement)
    })

</script>

<main>
    <canvas bind:this={canvasElement} />
</main>