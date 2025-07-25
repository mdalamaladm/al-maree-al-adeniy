<script>
	import LoadingIcon from "$lib/icons/LoadingIcon.svelte";
	import { loader } from "./loader.svelte";
	import Overlay from "./Overlay.svelte";
</script>

<Overlay
  center
  bind:open={loader.open}
>
  <div
    class="
      flex
      flex-col
      items-center
    "
  >
    <LoadingIcon
      class="
        animate-spin
        h-10
        w-10
        text-maree-accent
        size-10
      "
    />
    <p
      class="
        mt-5
        text-2xl
        text-maree-accent
      "
    >
      {loader.message}
    </p>
  </div>
</Overlay>