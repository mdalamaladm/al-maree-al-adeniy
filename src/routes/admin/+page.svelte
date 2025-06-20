<script>
	import Overlay from "$lib/components/Overlay.svelte";
	import AttachmentIcon from "$lib/icons/AttachmentIcon.svelte";
	import CloseIcon from "$lib/icons/CloseIcon.svelte";
  
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
    files.push(...e.target.files);
  }

  function onRemoveFile (i) {
    files = files.filter((_, index) => index !== i);
  }
</script>

<section
  class="
    min-h-screen
    p-10
    bg-maree-main
  "
>
  <Overlay
    bind:open
    center
  >
    <form
      class="
        w-96
        h-96
        p-10
        bg-white
        rounded-lg
      "
    >
      <div>
        <input
          type="text"
          placeholder="username"
          class="
            col-row-1
            block
            w-full
            p-5
            mb-10
            text-maree-darker-accent
            text-xl
            border-3
            border-solid
            border-maree-darker-accent
          "
        >
        <input
          type="password"
          placeholder="password"
          class="
            col-row-1
            block
            w-full
            p-5
            mb-10
            text-maree-darker-accent
            text-xl
            border-3
            border-solid
            border-maree-darker-accent
          "
        >
      </div>
      <button
        type="submit"
        class="
          grid
          place-content-center
          w-full
          p-5
          mb-10
          bg-maree-secondary
          text-maree-accent
          text-xl
          rounded-lg
          cursor-pointer
        "
      >
        Submit
      </button>
    </form>
  </Overlay>
  <h1
    class="
      text-6xl
      text-maree-secondary
      text-center
      font-medium
    "
  >
    Upload
  </h1>
  <div 
    class="
      grid
      grid-cols-3
      gap-10
      mt-15
    "
  >
    <select
      class="
        col-span-1
        p-3
        bg-maree-accent
        text-maree-darker-accent
        rounded-xl
      "
    >
      {#each types as type (type.value)}
        <option value={type.value}>{type.name}</option>
      {/each}
    </select>
    <select
      class="
        col-span-1
        p-3
        bg-maree-accent
        text-maree-darker-accent
        rounded-xl
      "
    >
      <option value="aqidah">Aqidah</option>
    </select>
    <select
      class="
        col-span-1
        p-3
        bg-maree-accent
        text-maree-darker-accent
        rounded-xl
      "
    >
      <option value="audio">Audio</option>
      <option value="video">Video</option>
    </select>
  </div>
  <div
    class="
      grid
      place-content-center
      mt-15
    "
  >
    <label
      class="
        mb-10
      "
    >
      <div
        class="
          grid
          place-content-center
          w-[400px]
          p-5
        text-maree-darker-accent
          border-3
          border-dashed
          border-maree-darker-accent
          cursor-pointer
        "
      >
        <AttachmentIcon
          class="
            size-15
            justify-self-center
          "
        />
        <p>Masukkan File</p>
      </div>
      <input
        onchange={onInputFile}
        type="file"
        accept="audio/*,video/*"
        multiple
        class="
          invisible
          absolute
          z-
        "
      >
    </label>
    <button
      onclick={() => open = true}
      disabled={files.length < 1}
      class="
        grid
        place-content-center
        p-5
        mb-10
        bg-maree-secondary
        text-maree-accent
        text-xl
        rounded-lg
        cursor-pointer
      "
    >
      Upload
    </button>
  </div>
  <div>
    <div
      class="
        grid
        grid-cols-4
        gap-5
      "
    >
      {#each files as file, i (i)}
        <div
          class="
            col-span-1
            flex
            items-center
            p-4
            bg-maree-dark-accent
            text-maree-accent
            rounded-lg
          "
        >
          <p
            class="
              text-xl
            "
          >
            {file.name}
          </p>
          <CloseIcon
            onclick={() => onRemoveFile(i)}
            class="
              size-8
              flex-none
              mr-5
              cursor-pointer
            "
          />
        </div>
      {/each}
    </div>
  </div>
</section>