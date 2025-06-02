<script>

  let amplitudes = $state([])
  
  async function onCheckAmplitudes () {
    const file = await fetch('./sample-2.mp3')
    let chunkSize = 500;
    let audioContext = new AudioContext();
    let buffer = await file.arrayBuffer(),
            audioBuffer = await audioContext.decodeAudioData(buffer),
            float32Array = audioBuffer.getChannelData(0);
    let array = [], i = 0, length = float32Array.length;
    while (i < length) {
        array.push(
            float32Array.slice(i, i += chunkSize).reduce(function (total, value) {
                return Math.max(total, Math.abs(value));
            })
        );
    }

    console.log(array);

    amplitudes = array;
  }
</script>

<div>
  <h1 class="my-5 text-center text-5xl text-maree-secondary font-medium">المحاضرات</h1>
  <div class="flex justify-center">
    <select class="py-5 px-10 text-2xl">
      <option>العقيدة والتوخيد</option>
    </select>
  </div>
  <audio src="./sample-2.mp3" controls></audio>
  <button onclick={onCheckAmplitudes}>check amplitudes</button>
  <div class="flex items-center">
    {#each amplitudes as ap, i}
      <div style="width: 1px; height: {ap * 300}px; background-color: red; margin-right: 1px;"></div>
    {/each}
  </div>
</div>
