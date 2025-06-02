<script>
  // let { src } = $props();

  let amplitudes = $state(new Array(80).fill(0.05))
  
  async function onCheckAmplitudes () {
    const file = await fetch('./sample-2.mp3')
    const audioContext = new AudioContext();
    const buffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    
    const samples = 80; // Number of samples we want to have in our final data set
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
</script>

<div>
  <audio src="./sample-2.mp3" controls></audio>
  <button onclick={onCheckAmplitudes}>check amplitudes</button>
  <div class="flex items-center h-48">
    {#each amplitudes as ap, i}
      <div class="flex-none w-2.5 max-h-48 mr-[1.5px] bg-maree-dark-accent transition-[height]"style="height: {ap * 200}px;"></div>
    {/each}
  </div>
</div>
