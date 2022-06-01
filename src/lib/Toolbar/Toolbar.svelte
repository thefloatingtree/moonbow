<script lang="ts">
    import Collaborators from "./CollaboratorList.svelte";
import ToolList from "./ToolList.svelte";
</script>

<div class="absolute flex space-x left-3 top-3 bottom-3">
    <div class=" flex flex-col items-center justify-between w-14 h-full bg-[#171717] shadow-black/30 shadow-lg rounded-2xl ">
        <ToolList></ToolList>
        <Collaborators></Collaborators>
    </div>

</div>
