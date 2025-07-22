<script>
	import { onMount } from "svelte";
	import PlayButton from "$lib/components/audio-player/PlayButton.svelte";

  let { src, duration, length, handleEnd } = $props();

  let chunk = $state(30);
  let amplitudes = $state(new Array(chunk).fill(-1));
  let rawData = $state([]);
  let innerWidth = $state(null);
  let audioElement = $state(null);
  let audioElementDuration = $state(null);
  let currentTime = $state(0);
  let seekable = $state(0);
  let isPlay = $state(false);
  let isMouseDown = $state(false);
  let isReady = $state(true);
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
    audioElement = document.querySelector('audio.player');
    audioElementDuration = document.querySelector('audio.duration')
    innerWidth = window.innerWidth;

    onChangeInnerWidth();
  })
  
  async function loadAudio (src) {
    if(!src) return;

    audioElement.pause();
    currentTime = 0;
    // isReady = false;
    isPlay = false;
    resetAmplitudes();

    console.log('URLLLL', src);

    const mediaSource = new MediaSource();
    const audio = new Audio();

    const response = await fetch(src);
    const response2 = await fetch(src);
    const blob = await response.blob();
    const reader = response2.body?.getReader();
    console.log('READER', reader);
    audioElement.duration = duration;
    audioElement.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', async () => {
      console.log('TEST BUFFER');
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg'); // Or 'audio/mp4', etc.
      // You can set the update mode here if needed, e.g., 'sequence'
      // sourceBuffer.mode = 'sequence'; 
      const response = await fetch(src);
      const reader = response.body?.getReader();
      console.log('READER', reader);

      if (!sourceBuffer.updating) { // Check if the buffer is not already updating
          const { value } = await reader?.read();
            console.log('UPDATE BUFFER', value);
          sourceBuffer.appendBuffer(value.buffer);
          rawData.concat([...value.buffer]);
      }
      
      // Handle 'updateend' event to append next buffer
      sourceBuffer.addEventListener('updateend', async () => {
        if (!sourceBuffer.updating) { // Check if the buffer is not already updating
            const { value } = await reader?.read();
            console.log('UPDATE BUFFER 2', value);
          // await d(2000);
          // sourceBuffer.appendBuffer(new ArrayBuffer(8));
          sourceBuffer.appendBuffer(value.buffer);
          rawData.concat([...value.buffer]);

        }
          // Logic to append the next audio chunk/buffer
          // For example, fetch the next chunk and call sourceBuffer.appendBuffer()
      });
    });

    // const audioContext = new AudioContext();
    // const blob = await response.blob();
    // const buffer = await blob.arrayBuffer();
    // audioElement.src = URL.createObjectURL(blob);
    // const audioBuffer = await audioContext.decodeAudioData(buffer);
    // rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    // currentTime = audioElement.currentTime;
    // seekable = audioElement.seekable.length ? (audioElement.seekable.end(audioElement.seekable.length - 1)) : 0;
    
    // setAmplitudes();

    // isReady = true;
  }

  function sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function setAmplitudes () {
    const samples = chunk; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = []

    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }

      filteredData.push(sum / blockSize * 6); // divide the sum by the block size to get the average
    }

    const multiplier = Math.pow(Math.max(...filteredData), -1);
    amplitudes = filteredData.map(n => n * multiplier);
  }

  function resetAmplitudes () {
    amplitudes = new Array(chunk).fill(-1);
  }

  function onTimeUpdate (e) {
    currentTime = e.target.currentTime;
  }

  function onEnded () {
    handleEnd();
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

      if (rawData.length > 0) setAmplitudes();
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

    amplitudes = new Array(chunk).fill(-1);
  }

  $effect(() => {
    loadAudio(src);
  })

  function onLoadMetaData () {
  }

  $effect(() => {
    if (audioElementDuration?.readyState > 0) {
      console.log('DURATION', audioElementDuration?.duration);
    } else {
      audioElementDuration?.addEventListener('loadedmetadata', () => {
        console.log('DURATION', audioElementDuration?.duration);
      });
    }
  })
</script>

<svelte:window
  onkeydown={onKeyDown}
  onresize={onResize}
/>

<div>
  {rawData.length}
  <audio
    ontimeupdate={onTimeUpdate}
    onended={onEnded}
    controls
    controlsList="nodownload"
    preload="metadata"
    class="player"
  ></audio>
  <audio
    onloadedmetadata={onLoadMetaData}
    preload="metadata"
    class="duration"
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
        {#each amplitudes as ap, i}
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
              height: {ap < 0 ? (0.05 * 200) : (ap * 200)}px;
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
