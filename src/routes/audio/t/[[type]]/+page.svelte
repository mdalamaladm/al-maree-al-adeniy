<script>
  import AudioPlayer from "$lib/components/audio-player/AudioPlayer.svelte";
	import Playlist from "$lib/components/audio-player/Playlist.svelte";
	import PlaylistIcon from "$lib/icons/PlaylistIcon.svelte";
	import Overlay from "$lib/components/Overlay.svelte";
  import BreadCrumbs from "$lib/components/BreadCrumbs.svelte";
	import InboxIcon from "$lib/icons/InboxIcon.svelte";
	import { tick } from "svelte";

  let { data } = $props();

  let open = $state(false);
  let content = $state(null);
  let playlist = $state([]);

  let trackId = $state(null);
  let trackSrc = $state(null);

  let track = $derived.by(() => {
    return playlist?.find(s => s.id === trackId) || { name: '' };
  });
  let filteredPlaylist = $derived.by(() => {
    if (content) {
      return playlist?.filter(p => p.content === content) || [];
    } else {
      return playlist;
    }
  })

  function onChangeAudio (id) {
    trackId = id;
    open = false;
  }

  function handleEnd () {
    if (trackId === playlist?.length - 1) {
      trackId = playlist?.[0].id;
    } else {
      trackId++;
    }
  }
  
  function onResize () {
    open = false;
  }
  
  async function onChangeContent() {
    if (data.typeAlias === 'durus') {
      const response = await fetch('/audio', {
        method: 'POST',
        body: JSON.stringify({ content, type: data.typeAlias }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { playlist: newPlaylist } = await response.json();

      playlist = newPlaylist
        .map(f => ({
        ...f,
        content: f.content.id,
        amplitudes: JSON.parse(f.amplitudes),
      }));
      trackId = newPlaylist[0]?.id;
    }
  }

  $effect(() => {
    async function run () {
      const response = await fetch('/audio/byId', {
        method: 'POST',
        body: JSON.stringify({ id: track.id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { src } = await response.json();

      trackSrc = src;
    }
    
    run();
  })

  $effect(() => {
    async function run () {
      if (data.typeAlias === 'durus') {
        content = data.contents[0].value
      }

      await tick()
      
      playlist = data.playlist;
      trackId = data.playlist[0]?.id
    }

    run()
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
      {trackId}
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
          name: 'صوتيات'
        },
        {
          name: data.typeName
        },
      ]}
      color="text-maree-secondary"
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
        text-maree-secondary
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
      {trackId}
      class="
        hidden
        lg:block
        lg:mr-5
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
          onchange={onChangeContent}
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
          mx-5
          text-maree-secondary
          text-3xl
          font-medium
          text-center
        "
      >
        {track.name}
      </p>
      {#if playlist?.length > 0}
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
