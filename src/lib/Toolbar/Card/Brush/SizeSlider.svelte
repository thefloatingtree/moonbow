<script lang="ts">
    import { size } from "../../../stores/brushSettings";

    // export let value = 99

    // $: {
    //     $size = value
    // }
</script>

<input bind:value={$size} type="range" class="form-range appearance-none w-full h-5 px-1 bg-white rounded-full focus:outline-none focus:ring-0 focus:shadow-none"/>