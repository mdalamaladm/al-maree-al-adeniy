<script>
  let { class: className = '', listClass = '', onChangeAudio, playlist, trackNumber } = $props();

  let search = $state('');
  let searchedPlaylist = $derived.by(() => {
    return playlist.filter(s => s.name.includes(search));
  })
</script>

<div
  class={className}
>
  <div
    class="
      grid
      grid-cols-1
      place-content-center
      xl:mx-10
      mb-3
    "
  >
    <input
      class="
        col-span-1
        p-2
        bg-maree-accent
        text-xl
        text-maree-darker-accent
        font-medium
        rounded-xl
      "
      type="text"
      name="search"
      id="search"
      placeholder="ابحث"
      bind:value={search}
    >
  </div>
  <div
    class={`
      flex-none
      flex
      flex-col
      h-[calc(100vh-200px)]
      w-72
      lg:w-80
      xl:w-[400px]
      xl:mx-10
      p-5
      bg-maree-dark-accent
      rounded-xl
      overflow-auto
      [&::-webkit-scrollbar]:w-3
      [&::-webkit-scrollbar-track]:bg-maree-accent
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-maree-darker-accent
      [&::-webkit-scrollbar-thumb]:rounded-full
      ${listClass}
    `}
  >
    {#each searchedPlaylist as sound (sound.id) }
      <button
        onclick={() => onChangeAudio(sound.id)}
        class={`
          flex-none
          p-3
          mb-2
          ${trackNumber === sound.id ? 'bg-maree-darker-accent' : ''}
          hover:bg-maree-darker-accent
          active:bg-maree-darker-accent
          text-start
          text-xl
          text-maree-accent
          font-medium
          cursor-pointer
          rounded-xl
        `
      }
      >
        {sound.name}
      </button>
    {/each}
  </div>
</div>