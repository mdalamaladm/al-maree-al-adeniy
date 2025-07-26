<script>
  import AudioPlayer from "$lib/components/audio-player/AudioPlayer.svelte";
	import Playlist from "$lib/components/audio-player/Playlist.svelte";
	import PlaylistIcon from "$lib/icons/PlaylistIcon.svelte";
	import Overlay from "$lib/components/Overlay.svelte";
  import BreadCrumbs from "$lib/components/BreadCrumbs.svelte";
	import InboxIcon from "$lib/icons/InboxIcon.svelte";

  let { data } = $props();

  let open = $state(false);
  let content = $state(null);

  let trackNumber = $state(data.playlist[0]?.id);
  let trackSrc = $state(null);
  let trackDuration = $state(null);
  let trackLength = $state(null);

  let track = $derived.by(() => {
    return data.playlist.find(s => s.id === trackNumber) || { name: '' };
  });
  let filteredPlaylist = $derived.by(() => {
    if (content) {
      return data.playlist.filter(p => p.content === content);
    } else {
      return data.playlist;
    }
  })

  function onChangeAudio (id) {
    trackNumber = id;
    open = false;
  }

  function handleEnd () {
    if (trackNumber === data.playlist.length - 1) {
      trackNumber = 0;
    } else {
      trackNumber++;
    }
  }
  
  function onResize () {
    open = false;
  }

  $effect(() => {
    async function run () {
      const response = await fetch('/audio', {
        method: 'POST',
        body: JSON.stringify({ id: track.id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { src, duration, length } = await response.json();

      trackSrc = src;
      trackDuration = duration;
      trackLength = length;
    }

    run();
  })
</script>

<svelte:window
  onresize={onResize}
/>


<section
  class="
    min-h-screen
    pb-10
    bg-maree-main
  "
>
  <Overlay
    bind:open
    closeOutside
  >
    <Playlist
      {onChangeAudio}
      playlist={filteredPlaylist}
      {trackNumber}
      class="
        h-full
        w-full
        max-w-[400px]
      "
      listClass="
        w-full
        max-w-[400px]
      "
    />
  </Overlay>
	<div
    class="
      flex
      justify-between
      lg:justify-start
    "
  >
    <BreadCrumbs
      items={[
        {
          href: '/',
        },
        {
          href: '/audio',
          name: 'الصوتية'
        },
        {
          name: data.typeName
        },
      ]}
      class="
        mx-3
        md:mx-10
        my-8
      "
    />

		<button
      onclick={() => open = true}
      class="
        lg:hidden
        self-start
        my-8
        ml-5
        mr-2
        md:mr-5
        text-maree-dark-accent
        cursor-pointer
      "
    >
			<PlaylistIcon />
		</button>
	</div>
  <div
    class="
      lg:flex
      lg:items-stretch
    "
  >
    <Playlist
      {onChangeAudio}
      playlist={filteredPlaylist}
      {trackNumber}
      class="
        hidden
        lg:block
      "
      listClass="
        min-h-[550px]
      "
    />
    <div
      class="
        flex-1
      "
    >
      <h1
        class="
          my-2
          text-center
          text-5xl
          text-maree-secondary
          font-medium
        "
      >
        {data.typeName}
      </h1>
      <div
        class="
          flex
          justify-center
          my-5
        "
      >
        <select
          bind:value={content}
          class="
            w-[250px]
            py-5
            px-10
            text-2xl
          "
        >
          {#each data.contents as content (content.value)}  
            <option value={content.value}>{content.name}</option>
          {/each}
        </select>
      </div>
      <p
        class="
          mb-10
          text-maree-secondary
          text-3xl
          font-medium
          text-center
        "
      >
        {track.name}
      </p>
      {#if data.playlist.length > 0}
        <AudioPlayer
          id={track.id}
          src={trackSrc}
          amplitudes={track.amplitudes}
          {handleEnd}
        />
      {:else}
        <div
          class="
            flex-1
            flex
            flex-col
            items-center
            text-maree-darker-accent
          "
        >
          <InboxIcon
            class="
              size-25
              mt-10
              mb-5
            "
          />
          <p
            class="
              mb-5
              text-4xl
              font-medium
            "
          >
            عذرا
          </p>
          <p
            class="
              text-2xl
            "
          >
            الصوتيات فارغة
          </p>
        </div>
      {/if}
    </div>
  </div>
</section>
