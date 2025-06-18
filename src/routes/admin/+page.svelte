<script>
	import Overlay from "$lib/components/Overlay.svelte";
  
  let open = $state(false);

  let types = [
    {
      name: 'المحاضرات',
      value: 1,
    },
    {
      name: 'الخطب',
      value: 2,
    },
    {
      name: 'الدروس',
      value: 3,
    },
    {
      name: 'الفتاوى',
      value: 4,
    },
  ]

  let files = $state([]);

  function onInputFile (e) {
    console.log(e.target.files)
    files = e.target.files
  }
</script>

<section>
  <Overlay bind:open>
    <div class="w-96 h-96 bg-white">
      <form>
        <input type="text" placeholder="username">
        <input type="password" placeholder="password">
        <button type="submit">Submit</button>
      </form>
    </div>
  </Overlay>
  <h1>
    Upload
  </h1>
  <div>
    <select>
      {#each types as type (type.value)}
        <option value={type.value}>{type.name}</option>
      {/each}
    </select>
    <select>
      <option value="aqidah">Aqidah</option>
    </select>
  </div>
  <div>
    <input onchange={onInputFile} type="file" accept="audio/*,video/*" multiple>
    <div>
      {#each files as file}
        {file.name}
      {/each}
    </div>
    <button onclick={() => open = true} disabled={files.length < 1}>Upload</button>
  </div>
</section>