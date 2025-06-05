<script>
	import { onMount } from "svelte";

  // let { src } = $props();

  const chunk = 80;
  let amplitudes = $state(new Array(chunk).fill(-1))
  let audioElement = $state(null);
  let currentTime = $state(0);
  let seekable = $state(0);
  let isPlay = $state(false);
  let isMouseDown = $state(false);

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
    audioElement = document.querySelector('audio');

    loadAudio();
  })
  
  async function loadAudio () {
    const response = await fetch('./sample-2.mp3');
    const audioContext = new AudioContext();
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    audioElement.src = URL.createObjectURL(blob);
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    
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

    currentTime = audioElement.currentTime;
    seekable = audioElement.seekable.length ? (audioElement.seekable.end(audioElement.seekable.length - 1)) : 0;

    audioElement.addEventListener('timeupdate', (event) => {
      currentTime = event.target.currentTime;
    })
  }

  function onPlay () {
    if (isPlay) {
      audioElement.pause();
      isPlay = false;
    } else {
      audioElement.play();
      isPlay = true;
    }
  }

  function onMouseDown (e, i) {
    e.preventDefault();
    if (e.offsetX >= 0) {
      isMouseDown = true;
      console.log((i * l.block) + (l.block * (1 - (e.offsetX / e.target.offsetWidth))));
      audioElement.currentTime = (i * l.block) + (l.block * (1 - (e.offsetX / e.target.offsetWidth)));
    }
  }

  function onMouseMove (e, i) {
    if (isMouseDown && e.offsetX >= 0) {
      console.log((i * l.block) + (l.block * (1 - (e.offsetX / e.target.offsetWidth))));
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
</script>

<svelte:window onkeydown={onKeyDown} />

<div>
  <audio controls controlsList="nodownload" preload="metadata" loop></audio>
  <div class="flex flex-col items-center">
    <button onclick={() => { audioElement.currentTime = 200 }}>Ceck</button>
    <div class="flex items-center">
      <div class="flex items-center h-48" dir="rtl">
        {#each amplitudes as ap, i}
          <div onmousedown={(e) => onMouseDown(e, i)} onmousemove={(e) => onMouseMove(e, i)} onmouseup={() => isMouseDown = false} class="flex-none w-2.5 max-h-48 mr-[1.5px] transition-[height]" style="height: {ap < 0 ? (0.05 * 200) : (ap * 200)}px; background: {ap < 0 ? '#95BB76' : (l.current >= i * l.block && l.current <= (i + 1) * l.block ? `linear-gradient(to left, #D3F7AD ${Math.floor(((l.current - (l.block * i)) / l.block) * 100)}%, #95BB76 ${Math.floor(((l.current - (l.block * i)) / l.block) * 100)}%)` : (l.current <= (i + 1) * l.block ? '#95BB76' : '#D3F7AD'))}"></div>
        {/each}
      </div>
      <button onclick={onPlay} class="flex-none flex justify-center items-center p-5 ml-10 bg-maree-dark-accent text-maree-accent rounded-full cursor-pointer">
        {#if isPlay}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
            <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
            <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
          </svg>
        {/if}
      </button>
    </div>
    <p class="my-10 text-3xl text-maree-dark-accent font-bold">{time}</p>
  </div>
  <div>
    
  </div>
</div>
