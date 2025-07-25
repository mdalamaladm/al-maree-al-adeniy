<script>
	import { onMount } from "svelte";
	import PlayButton from "$lib/components/audio-player/PlayButton.svelte";

  let { id, src, amplitudes, handleEnd } = $props();

  let chunk = $state(60);
  let _amplitudes = $state(new Array(chunk).fill(-1));
  let _id = $state(null);
  let rawData = [];
  let innerWidth = $state(null);
  let audioElement = $state(null);
  let currentTime = $state(0);
  let seekable = $state(0);
  let buffered = $state(0);
  let isPlay = $state(false);
  let isMouseDown = $state(false);
  let isReady = $state(false);
  let timeout = $state(null);

  let l = $derived.by(() => {
    const current = currentTime;
    const block = seekable / chunk;

    return {
      block,
      current
    };
  });

  let time = $derived.by(() => {
    const minutes = Math.floor(currentTime / 60);
    const hours = Math.floor(minutes / 60);
    let seconds = Math.floor(currentTime % 60);
    const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${hours ? `${hours}:` : ''}${paddedMinutes}:${paddedSeconds}`;
  })
  

  onMount(() => {
    onChangeInnerWidth();
  })

  function setAmplitudes () {
    const result = [];
    let i = 0;
    let merged = 0;

    while (i < 60) {
      if (merged < 60 - chunk) {
        const avg = (amplitudes[i] + amplitudes[i + 1]) / 2;
        result.push(avg);
        i += 2;
        merged++;
      } else {
        result.push(amplitudes[i]);
        i++;
      }
    }

    _amplitudes = result;
  }

  function resetAmplitudes () {
    _amplitudes = new Array(chunk).fill(-1);
  }

  function onTimeUpdate (e) {
    currentTime = e.target.currentTime;
  }

  function onEnded () {
    handleEnd();
  }

  function onLoadedData (e) {
    buffered = audioElement.buffered.length ? (audioElement.buffered.end(audioElement.buffered.length - 1)) : 0;
    seekable = audioElement.seekable.length ? (audioElement.seekable.end(audioElement.seekable.length - 1)) : 0;
    isReady = true;
  }

  function onPlay () {
    if (!isReady) return;

    if (isPlay) {
      audioElement.pause();
      isPlay = false;
    } else {
      audioElement.play();
      isPlay = true;
    }
  }

  function onMouseDown (e, i) {
    if (!isReady) return;

    e.preventDefault();

    if (e.offsetX >= 0) {
      isMouseDown = true;
      audioElement.currentTime = (i * l.block) + (l.block * (1 - (e.offsetX / e.target.offsetWidth)));
    }
  }

  function onMouseMove (e, i) {
    if (isMouseDown && e.offsetX >= 0) {
      audioElement.currentTime = (i * l.block) + (l.block * (1 - (e.offsetX / e.target.offsetWidth)));
    }
  }

  function onKeyDown (e) {
    if (isPlay) {
      if (e.code === 'ArrowLeft') {
        if (audioElement.currentTime + 10 > seekable) {
          audioElement.currentTime = seekable;
        } else {
          audioElement.currentTime += 10;
        }
      } else if (e.code === 'ArrowRight') {
        if (audioElement.currentTime - 10 < 0) {
          audioElement.currentTime = 0;
        } else {
          audioElement.currentTime -= 10;
        }
      }
    }
  }

  function onResize (e) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      innerWidth = e.target.innerWidth;

      onChangeInnerWidth();
    }, 2000)
  }

  function onChangeInnerWidth () {
    if (innerWidth < 450) {
      chunk = 30;
    } else if (innerWidth < 650) {
      chunk = 40;
    } else if (innerWidth < 1024) {
      chunk = 60;
    } else if (innerWidth < 1131) {
      chunk = 45;
    } else if (innerWidth < 1280) {
      chunk = 50;
    } else if (innerWidth < 1350) {
      chunk = 55;
    } else {
      chunk = 60;
    }
  }

  $effect(() => {
    // Make sure this "reset" only run when the id is different
    if (id !== _id) {
      _id = id;

      audioElement.pause();
      audioElement.currentTime = 0;
      currentTime = 0;
      isReady = false;
      isPlay = false;
      resetAmplitudes();
    }
  })

  $effect(() => {
    if (isReady) {
      setAmplitudes();
    }
  })
</script>

<svelte:window
  onkeydown={onKeyDown}
  onresize={onResize}
  bind:innerWidth
/>

<div>
  <audio
    bind:this={audioElement}
    ontimeupdate={onTimeUpdate}
    onended={onEnded}
    onloadeddata={onLoadedData}
    controls
    controlsList="nodownload"
    preload="auto"
    src={src}
    class="hidden"
  ></audio>
  <div
    class="
      grid
      grid-cols-6
      gap-10
      mx-5
      xl:mx-10
    "
  >
    <div
      class="
        col-span-6
        justify-self-center
        flex
        items-center
      "
    >
      <PlayButton
        {onPlay}
        {isReady}
        {isPlay}
        class="
          hidden
          lg:grid
          ml-10
        "
      />
      <div
        class="
          flex
          items-center
          h-48
        "
      >
        {#each _amplitudes as ap, i}
          <div
            onmousedown={(e) => onMouseDown(e, i)}
            onmousemove={(e) => onMouseMove(e, i)}
            onmouseup={() => isMouseDown = false}
            class="
              flex-none
              w-2
              lg:w-2.5
              max-h-48
              mr-[1.5px]
              transition-[height]
            "
            style="
              height: {ap < 0 ? (0.05 * 200) : (ap)}px;
              background: {ap < 0 ? '#95BB76' : (l.current >= i * l.block && l.current <= (i + 1) * l.block ? `linear-gradient(to left, #D3F7AD ${Math.floor(((l.current - (l.block * i)) / l.block) * 100)}%, #95BB76 ${Math.floor(((l.current - (l.block * i)) / l.block) * 100)}%)` : (l.current <= (i + 1) * l.block ? '#95BB76' : '#D3F7AD'))}
            "
          ></div>
        {/each}
      </div>
    </div>
    <PlayButton
      {onPlay}
      {isReady}
      {isPlay}
      class="
        lg:hidden
      "
    />
    <p
      class="
        col-span-6
        lg:col-span-6
        sm:col-span-3
        justify-self-center
        self-center
        sm:my-10
        text-3xl
        text-maree-dark-accent
        font-bold
      "
    >
      {time}
    </p>
  </div>
</div>
