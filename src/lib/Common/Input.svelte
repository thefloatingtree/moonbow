<script>
    export let value = ""
    export let placeholder = ""
</script>

<input bind:value placeholder={placeholder} type="text" class="transition-all ease-out duration-300 bg-white bg-opacity-10 text-white focus:bg-white focus:bg-opacity-20 w-full h-12 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
