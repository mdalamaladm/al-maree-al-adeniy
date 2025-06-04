<script>
	import { onMount } from "svelte";

  // let { src } = $props();

  const chunk = 80;
  let amplitudes = $state(new Array(chunk).fill(-1))
  let audioElement = $state(null);
  let currentTime = $state(0);
  let seekable = $state(0)

  let l = $derived.by(() => {
    const current = currentTime;
    const block = seekable / chunk;
    console.log(current, block)

    return {
      block,
      current
    };
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
      console.log(event.target.currentTime);
      currentTime = event.target.currentTime;
    })
  }
</script>

<div>
  <audio controls></audio>
  <div>
    <button>{}</button>
    <div class="flex items-center h-48" dir="rtl">
      {#each amplitudes as ap, i}
        <div class="flex-none w-2.5 max-h-48 mr-[1.5px] transition-[height]" style="height: {ap < 0 ? (0.05 * 200) : (ap * 200)}px; background: {ap < 0 ? '#95BB76' : (l.current >= i * l.block && l.current <= (i + 1) * l.block ? `linear-gradient(to left, #D3F7AD ${Math.floor(((l.current - (l.block * i)) / l.block) * 100)}%, #95BB76 ${Math.floor(((l.current - (l.block * i)) / l.block) * 100)}%)` : (l.current <= (i + 1) * l.block ? '#95BB76' : '#D3F7AD'))}"></div>
      {/each}
    </div>
    <div>

    </div>
  </div>
  <div>
    
  </div>
</div>
