<script lang="ts">
    import Collaborators from "./CollaboratorList.svelte";
import ToolList from "./ToolList.svelte";
</script>

<div class="absolute flex flex-col items-center justify-between left-3 top-3 bg-[#171717] shadow-gray-800 shadow-lg w-14 rounded-2xl bottom-3">
    <ToolList></ToolList>
    <Collaborators></Collaborators>
</div>
