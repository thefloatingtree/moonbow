<script lang="ts">
    export let active = false;

    const allStyle = "hover:scale-110 active:scale-95 transition-all cursor-pointer duration-75 w-auto p-4";
    const activeStyle = "text-white";
    const inactiveStyle = "text-gray-500 hover:text-gray-400";
</script>


<div on:click class={`${allStyle} ${(active ? activeStyle : inactiveStyle)}`}>
    <slot></slot>
</div>