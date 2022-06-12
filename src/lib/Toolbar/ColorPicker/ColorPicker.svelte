<script lang="ts">
    // this library doesn't have good typings for the component prop
    // @ts-nocheck
    import ColorPicker from "svelte-awesome-color-picker/ColorPicker.svelte";
    import SliderIndicator from "./SliderIndicator.svelte";
    import SliderWrapper from "./SliderWrapper.svelte";
    import PickerIndicator from "./PickerIndicator.svelte";
    import PickerWrapper from "./PickerWrapper.svelte";
    import Wrapper from "./Wrapper.svelte";
    import { color, opacity } from "../../stores/brushSettings";
    import { colorPickerStore } from '../../stores/colorPicker';

    $: {
        if ($colorPickerStore.a && $colorPickerStore.hex) {
            $color = $colorPickerStore.hex.slice(0, -2)
            $opacity = $colorPickerStore.a
        }
    }
</script>

<ColorPicker
    toRight
    isOpen
    isPopup={false}
    bind:color={$colorPickerStore}
    components={{
        input: null,
        sliderIndicator: SliderIndicator,
        sliderWrapper: SliderWrapper,
        alphaIndicator: SliderIndicator,
        alphaWrapper: SliderWrapper,
        pickerIndicator: PickerIndicator,
        pickerWrapper: PickerWrapper,
        wrapper: Wrapper,
    }}
/>
