<script>
  import AudioPlayer from "$lib/components/AudioPlayer.svelte";
	import HomeIcon from "$lib/icons/HomeIcon.svelte";
	import Playlist from "$lib/components/Playlist.svelte";
	import PlaylistIcon from "$lib/icons/PlaylistIcon.svelte";
	import Overlay from "$lib/components/Overlay.svelte";

  let { data } = $props();

  let open = $state(false);
  let playlist = $state([
    {
      id: 1,
      name: 'صلة الرحم',
      src: '/sample-1.mp3',
    },
    {
      id: 2,
      name: 'الاعتصام بالسنة والحذر من البدعة',
      src: '/sample-2.mp3',
    },
    {
      id: 3,
      name: 'الفوز والنجاح بالتمسك بالكتاب والسنة',
      src: '/sample-3.mp3',
    },
    {
      id: 4,
      name: 'من اصول اهل السنة',
      src: '/sample-4.mp3',
    },
    {
      id: 5,
      name: 'شكر نعم الله تعالى',
      src: '/sample-5.mp3',
    },
    {
      id: 6,
      name: 'الله يدعو إلى دينه',
      src: '/sample-6.mp3',
    },
    {
      id: 7,
      name: 'محاضرة جامعة في احكام الصيام',
      src: '/sample-7.mp3',
    },
    {
      id: 8,
      name: 'حاجتنا إلى العمل الصالح',
      src: '/sample-8.mp3',
    },
    {
      id: 9,
      name: 'التمسك بدين الله سر نجاح الأمة',
      src: '/sample-9.mp3',
    },
    {
      id: 10,
      name: 'الآلات التي يحتاج إليها الدعاة إلى الله',
      src: '/sample-10.mp3',
    },
    {
      id: 11,
      name: 'الحذر من فتنة القتل',
      src: '/sample-11.mp3',
    },
    {
      id: 12,
      name: 'شكر نعمة الإسلام والسنة',
      src: '/sample-12.mp3',
    }
  ]);

  let trackNumber = $state(1);

  let track = $derived.by(() => {
    return playlist.find(s => s.id === trackNumber);
  });

  function onChangeAudio (id) {
    trackNumber = id;
    open = false;
  }

  function handleEnd () {
    if (trackNumber === playlist.length - 1) {
      trackNumber = 0;
    } else {
      trackNumber++;
    }
  }
  
  function onResize () {
    open = false;
  }
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
  <Overlay bind:open>
    <Playlist
      {onChangeAudio}
      {playlist}
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
    <a
      href="/"
      class="
        m-5
        text-maree-dark-accent
      "
    >
			<HomeIcon />
		</a>
		<button
      onclick={() => open = true}
      class="
        lg:hidden
        m-5
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
      lg:justify-center
      lg:items-stretch
    "
  >
    <Playlist
      {onChangeAudio}
      {playlist}
      {trackNumber}
      class="
        hidden
        lg:block
      "
      listClass="
        min-h-[550px]
      "
    />
    <div>
      <h1
        class="
          my-2
          text-center
          text-5xl
          text-maree-secondary
          font-medium
        "
      >
        {data.name}
      </h1>
      <div
        class="
          flex
          justify-center
          my-5
        "
      >
        <select
          class="
            py-5
            px-10
            text-2xl
          "
        >
          <option>العقيدة والتوحيد</option>
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
      <AudioPlayer
        src={track.src}
        {handleEnd}
      />
    </div>
  </div>
</section>
