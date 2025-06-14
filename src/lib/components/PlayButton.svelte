<script>
	import PauseIcon from "$lib/icons/PauseIcon.svelte";
	import PlayIcon from "$lib/icons/PlayIcon.svelte";
	import LoadingIcon from "$lib/icons/LoadingIcon.svelte";

  let { onPlay, isReady, isPlay, class: className } = $props();
</script>

<button
  onclick={onPlay}
  class={`
    col-span-6
    sm:col-span-3
    justify-self-center
    self-center
    grid
    place-content-center
    w-20
    h-20
    bg-maree-dark-accent
    text-maree-accent
    rounded-full
    cursor-pointer
    ${className}
  `}
>
  {#if isReady}
    {#if isPlay}
      <PauseIcon />
    {:else}
      <PlayIcon />
    {/if}
  {:else}
    <LoadingIcon class="animate-spin h-10 w-10 text-maree-accent" />
  {/if}
</button>