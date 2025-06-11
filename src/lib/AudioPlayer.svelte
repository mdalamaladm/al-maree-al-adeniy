<script>
	import { onMount } from "svelte";

  let chunk = $state(30);
  let amplitudes = $state(new Array(chunk).fill(-1));
  let rawData = $state([]);
  let innerWidth = $state(null);
  let audioElement = $state(null);
  let currentTime = $state(0);
  let seekable = $state(0);
  let isPlay = $state(false);
  let isMouseDown = $state(false);
  let isReady = $state(false);
  let playlist = $state([
    {
      name: 'Test 1',
      path: 'test-1'
    },
    {
      name: 'Test 1',
      path: 'test-1'
    },
    {
      name: 'Test 1',
      path: 'test-1'
    },
    {
      name: 'Test 1',
      path: 'test-1'
    },
    {
      name: 'Test 1',
      path: 'test-1'
    },
    {
      name: 'Test 1',
      path: 'test-1'
    },
    {
      name: 'Test 1',
      path: 'test-1'
    },
  ]);
  let trackNumber = $state(0);

  let l = $derived.by(() => {
    const current = currentTime;
    const block = seekable / chunk;

    return {
      block,
      current
    };
  });

  let track = $derived(playlist[trackNumber]);

  let time = $derived.by(() => {
    const minutes = Math.floor(currentTime / 60);
    const hours = Math.floor(minutes / 60);
    let seconds = Math.floor(currentTime % 60);
    const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${hours ? `${hours}:` : ''}${paddedMinutes}:${paddedSeconds}`;
  })
  

  onMount(() => {
    audioElement = document.querySelector('audio');
    innerWidth = window.innerWidth;

    onChangeInnerWidth();

    loadAudio();
  })
  
  async function loadAudio () {
    const response = await fetch('./sample-2.mp3');
    const audioContext = new AudioContext();
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    audioElement.src = URL.createObjectURL(blob);
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    currentTime = audioElement.currentTime;
    seekable = audioElement.seekable.length ? (audioElement.seekable.end(audioElement.seekable.length - 1)) : 0;
    
    setAmplitudes();

    isReady = true;
  }

  function setAmplitudes () {
    const samples = chunk; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = []

    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }

    const multiplier = Math.pow(Math.max(...filteredData), -1);
    amplitudes = filteredData.map(n => n * multiplier);
  }

  function onTimeUpdate (e) {
    currentTime = e.target.currentTime;
  }

  function onEnded () {
    isPlay = false;
    audioElement.currentTime = 0;
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
    innerWidth = e.target.innerWidth;

    onChangeInnerWidth();

    if (rawData.length > 0) setAmplitudes();
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
</script>

<svelte:window onkeydown={onKeyDown} onresize={onResize}/>

<div>
  <audio ontimeupdate={onTimeUpdate} onended={onEnded} controls controlsList="nodownload" preload="metadata" class="hidden"></audio>
  <div class="lg:flex lg:justify-center">
    <div class="grid grid-cols-6 gap-10 mx-5 xl:mx-10">
      <div class="col-span-6 justify-self-center flex items-center">
        <div class="flex items-center h-48" dir="rtl">
          {#each amplitudes as ap, i}
            <div
              onmousedown={(e) => onMouseDown(e, i)}
              onmousemove={(e) => onMouseMove(e, i)}
              onmouseup={() => isMouseDown = false}
              class="flex-none w-2 lg:w-2.5 max-h-48 mr-[1.5px] transition-[height]"
              style="height: {ap < 0 ? (0.05 * 200) : (ap * 200)}px; background: {ap < 0 ? '#95BB76' : (l.current >= i * l.block && l.current <= (i + 1) * l.block ? `linear-gradient(to left, #D3F7AD ${Math.floor(((l.current - (l.block * i)) / l.block) * 100)}%, #95BB76 ${Math.floor(((l.current - (l.block * i)) / l.block) * 100)}%)` : (l.current <= (i + 1) * l.block ? '#95BB76' : '#D3F7AD'))}"
            ></div>
          {/each}
        </div>
        <button onclick={onPlay} class="flex-none justify-self-center self-center hidden lg:flex justify-center items-center w-20 h-20 ml-10 bg-maree-dark-accent text-maree-accent rounded-full cursor-pointer">
          {#if isReady}
            {#if isPlay}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
                <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
                <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
              </svg>
            {/if}
          {/if}
        </button>
      </div>
      <p class="col-span-6 lg:col-span-6 sm:col-span-3 justify-self-center self-center sm:my-10 text-3xl text-maree-dark-accent font-bold">{time}</p>
      <button onclick={onPlay} class="lg:hidden col-span-6 sm:col-span-3 justify-self-center self-center flex justify-center items-center w-20 h-20 bg-maree-dark-accent text-maree-accent rounded-full cursor-pointer">
        {#if isReady}
          {#if isPlay}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
              <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
              <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
            </svg>
          {/if}
        {/if}
      </button>
    </div>
    <div class="flex-none hidden lg:grid grid-cols-1 w-72 lg:w-80 xl:w-[400px] mx-5 xl:mx-10 p-5 bg-maree-dark-accent rounded-xl">
      {#each playlist as sound }
        <button class="col-span-1 flex justify-end p-3 mb-2 hover:bg-maree-darker-accent active:bg-maree-darker-accent text-maree-accent cursor-pointer rounded-xl">{sound.name}</button>
      {/each}
    </div>
  </div>
</div>
