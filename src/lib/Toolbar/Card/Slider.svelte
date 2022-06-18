<script lang="ts">

    export let value
    export let min = 1
    export let max = 100
</script>

<input bind:value min={min} max={max} type="range" class="form-range appearance-none w-full h-2 bg-white rounded-full focus:outline-none focus:ring-0 focus:shadow-none"/>