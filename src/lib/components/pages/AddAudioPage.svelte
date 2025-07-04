<script>
	import InputFile from "$lib/components/input/InputFile.svelte";
	import ArrowPathIcon from "$lib/icons/ArrowPathIcon.svelte";
	import ChevronDownIcon from "$lib/icons/ChevronDownIcon.svelte";
	import CloseIcon from "$lib/icons/CloseIcon.svelte";
	import Button from "../Button.svelte";
	import { modal } from "../modal.svelte";

  let { options } = $props();

  let typeValue = $state({
    media: undefined,
    type: undefined,
    content: undefined,
  })

  let contentTypeOptions = $derived.by(() => {
    if (typeValue.type === 3) return options.lectures;
    else return options.others;
  });

  let globalOptions = $derived([
    {
      name: 'الوسيطة',
      type: 'media',
      options: options.medias
    },
    {
      name: 'النوع',
      type: 'type',
      options: options.types
    },
    {
      name: 'الموضوع',
      type: 'content',
      options: contentTypeOptions
    }
  ]);

  let mapMedias = $derived.by(() => {
    const map = new Map();

    for (const media of options.medias) {
      map.set(media.value, media.alias);
    }

    return map;
  });

  let mapTypes = $derived.by(() => {
    const map = new Map();

    for (const type of options.types) {
      map.set(type.value, type.alias);
    }

    return map;
  });


  let files = $state([]);
  let isUploading = $state(false);
  let order = $state(0);
  let dummyStatus = $state(false);

  let isProgressing = $derived.by(() => {
    return !!files.find(f => f.meta.status === 'progress');
  })

  let filesReady = $derived.by(() => {
    return files.filter(f => f.meta.status === 'ready');
  });

  let filesUpload = $derived.by(() => {
    return files.filter(f => f.meta.status !== 'ready');
  });

  function setGlobalValue (v, option) {
    typeValue[option.type] = v;

    if (option.type === 'media') {
      typeValue.type = options.types[0].value;
      typeValue.content = options.others[0].value;
    } else if (option.type === 'type') {
      if (v === 3) {
        typeValue.content = options.lectures[0].value;
      } else {
        typeValue.content = options.others[0].value;
      }
    }
  }

  function setEachFileValue (v, file, option) {
    file.meta[option.type] = v;

    if (option.type === 'media') {
      file.meta.type = options.types[0].value;
      file.meta.options[2].options = options.others;
      file.meta.content = options.others[0].value;
    } else if (option.type === 'type') {
      if (v === 3) {
        file.meta.options[2].options = options.lectures;
        file.meta.content = options.lectures[0].value;
      } else {
        file.meta.options[2].options = options.others;
        file.meta.content = options.others[0].value;
      }
    }
  }

  function onInputMedia (e) {
    const mapped = Array.from(e.target.files).map((f) => ({
      meta: {
        media: typeValue.media,
        type: typeValue.type,
        content: typeValue.content,
        xhr: null,
        progress: 0,
        status: 'ready',
        options: [
          {
            name: 'الوسيطة',
            type: 'media',
            options: options.medias
          },
          {
            name: 'النوع',
            type: 'type',
            options: options.types
          },
          {
            name: 'الموضوع',
            type: 'content',
            options: options.others
          }
        ],
      },
      file: f
    }))

    files.push(...mapped);
  }

  function onRemoveFile (i) {
    files = files.filter((_, index) => index !== i);
  }

  async function onUpload () {
    files.forEach(f => {
      if (f.meta.status === 'ready') {
        f.meta.status = 'wait';
      }
    })
    isUploading = true;
  }

  let timeout = $state(null);

  function delay (ms) {
    return new Promise(resolve => timeout = setTimeout(resolve, ms));
  }

  async function dummyProgress (file) {
    dummyStatus = true;
    file.meta.status = 'progress';
    file.meta.progress = 0;

    while (dummyStatus && file.meta.progress < 100) {
      await delay(500);

      if (file.meta.progress + 5 < 100) {
        file.meta.progress += 5;
      } else {
        file.meta.progress = 100;
        file.meta.status = 'complete';
      }

    }
  }

  function dummyAbort (file) {
    if (file.meta.status === 'progress') {
      dummyStatus = false;
      file.meta.status = 'abort';
      clearTimeout(timeout);
      orderIncrement();
    } else {
      file.meta.status = 'abort';
    }
  }

  async function eachFileUpload(order, fileParam) {
    const file = fileParam || files[order];

    try {
      // const key = `/${file.file.name}`
      
      file.meta.upload = () => eachFileUpload(order, file);
      file.meta.status = 'wait';

      console.log(1);

      if (!isProgressing) {
        console.log(2);
        await dummyProgress(file);
        orderIncrement();
        // const resUploadPresigned = await fetch(`/api/file/upload/presigned?${new URLSearchParams({ key })}`);

        // const uploadPresigned = await resUploadPresigned.text();

        // await uploadXHR({
        //   url: uploadPresigned,
        //   file,
        //   onProgress: (event) => {
        //     file.meta.status = 'progress';
        //     file.meta.progress = Math.round((event.loaded / event.total) * 100);
        //   },
        //   onSuccess: (xhr, resolve) => {
        //     file.meta.status = 'complete';
        //     orderIncrement();

        //     resolve(null)
        //   },
        //   onError: () => {
        //     file.meta.status = 'error';
        //     orderIncrement();
        //   },
        //   onAbort: () => {
        //     file.meta.status = 'abort';
        //     orderIncrement();
        //   }
        // });
      }
    } catch(e) {
      console.error(e);

      if (
        e.message !== 'Network error occured' &&
        !e.message.includes('HTTP error') &&
        e.message !== 'Network aborted'
      ) {
        file.meta.status = 'error';
        orderIncrement();
      }
    }
  }

  function uploadXHR ({
    url,
    file,
    onProgress = () => {},
    onSuccess = () => {},
    onError = () => {},
    onAbort = () => {}
  }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      file.meta.xhr = xhr;

      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          onProgress(event);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onSuccess(xhr, resolve);
        } else {
          onError(xhr);
          reject(new Error(`HTTP error! Status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        onError(xhr);
        reject(new Error('Network error occured'));
      });

      xhr.addEventListener('abort', () => {
        onAbort(xhr);
        reject(new Error('Network aborted'));
      });

      xhr.open('PUT', url, true);
      xhr.send(file.file);
    })
  }

  function orderIncrement() {
    const index = files.findIndex(f => f.meta.status === 'wait');

    if (index > -1) {
      order = index;
    } else {
      order = files.length;
    }
  }

  $effect(() => {
    if (isUploading) {
      if (order < files.length) {
        if (!isProgressing) {
          eachFileUpload(order);
        }
      }
    }
  });
</script>

{#snippet uploadList(close)}
  <div class="w-[500px] h-[500px] overflow-scroll">
    <div>
    {#each filesUpload as file, i (i)}
        <div
          class="
            flex-[0_1_300px]
            p-4
            mb-5
            bg-maree-dark-accent
            text-maree-accent
            rounded-lg
          "
        >
          <div
            class="
              flex
              items-center
            "
          >
            {JSON.stringify(file.meta.upload)}
            <p
              class="
                h-[80px]
                text-xl
                overflow-hidden
                line-clamp-3
              "
            >
              {file.file.name}
            </p>
          </div>
          <div
            class="
              h-[2px]
              my-3
              bg-maree-accent
            "
          ></div>
          <div
            class="
              grid
              grid-rows-3
              gap-2
            "
          >
            {#each file.meta.options as option (option.name)}
                <div
                  class="
                    p-3
                    bg-maree-accent
                    text-xl
                    text-maree-darker-accent
                    rounded-xl
                  "
                >
                  {option.options.find((o) => o.value === file.meta[option.type]).name}
                </div>
            {/each}
              <div
                class="
                  flex
                  items-center
                  mt-2
                "
              >
                <div
                  class="
                    flex-1
                  "
                >
                  {#if file.meta.status === 'wait'}
                    <div
                      class="
                        grid
                        place-content-center
                        h-10
                        bg-gray-400
                        text-xl
                        rounded-xl
                      "
                    >
                      Waiting...
                    </div>
                  {:else if file.meta.status === 'progress' || file.meta.status === 'complete'}
                    <div
                      class="
                        relative
                        h-10
                        bg-gray-400
                        text-xl
                        rounded-xl
                        overflow-hidden
                      "
                    >
                      <div
                        class="
                          h-full
                          bg-maree-secondary
                        "
                        style="
                          width: calc({file.meta.progress}%)
                        "
                      >
                      </div>
                      <div
                        class="
                          grid
                          place-content-center
                          absolute
                          top-0
                          left-0
                          w-full
                          h-full
                          text-maree-accent
                        "
                      >
                        {#if file.meta.status === 'progress'}
                          {file.meta.progress}%
                        {:else}
                          Uploaded
                        {/if}
                      </div>
                    </div>
                  {:else if file.meta.status === 'error'}
                    <div
                      class="
                        grid
                        place-content-center
                        h-10
                        bg-red-500
                        text-xl
                        rounded-xl
                      "
                    >
                      Error
                    </div>                
                  {:else if file.meta.status === 'abort'}
                    <div
                      class="
                        grid
                        place-content-center
                        h-10
                        bg-gray-400
                        text-xl
                        rounded-xl
                      "
                    >
                      Aborted
                    </div>
                  {/if}
                </div>
                <div
                  class="
                    flex-none
                    mr-5
                  "
                >
                  {#if file.meta.status === 'error' || file.meta.status === 'abort'}
                    <ArrowPathIcon
                      onclick={() => file.meta.upload()}
                      class="
                        size-8
                        cursor-pointer
                      "
                    />
                  {:else if file.meta.status === 'wait' || file.meta.status === 'progress'}
                    <CloseIcon
                      onclick={() => {
                        dummyAbort(file);
                        // file.meta.xhr.abort();
                      }}
                      class="
                        size-8
                        cursor-pointer
                      "
                    />
                  {/if}
                </div>
              </div>
          </div>
        </div>
      {/each}
  </div>
  <div>
    <Button
      onclick={close}
      type="solid"
      color="secondary"
      label="Close"
    />
  </div>
  </div>
{/snippet}

<section>
  <Button
    onclick={() => modal.open(uploadList)}
    type="solid"
    color="secondary"
    label="See List"
  />
  <h1
    class="
      text-6xl
      text-maree-secondary
      text-center
      font-medium
    "
  >
    التحميل
  </h1>
  <div
    class="
      flex
      flex-col
      lg:flex-row
      items-center
      lg:justify-center
      my-15
    "
  >
    <div 
      class="
        lg:flex-[0_0_400px]
        w-full
        max-w-[400px]
        grid
        grid-rows-3
        gap-5
        lg:ml-10
        mb-10
        lg:mb-0
      "
    >
      {#each globalOptions as option (option.name)}
        <label
          class="
            row-span-1
          "
        >
          <p
            class="
              mb-2
              text-maree-secondary
              font-medium
            "
          >
            {option.name}
          </p>
          <div
            class="
              relative
            "
          >
            <select
              bind:value={
                () => typeValue[option.type],
                (v) => setGlobalValue(v, option)
              }
              class="
                w-full
                p-3
                bg-maree-accent
                text-xl
                text-maree-darker-accent
                rounded-xl
                appearance-none
              "
            >
              {#each option.options as type (type.value)}
                <option value={type.value}>{type.name}</option>
              {/each}
            </select>
            <div
              class="
                grid
                place-content-center
                absolute
                top-0
                left-0
                h-full
                w-12
              "
            >
              <ChevronDownIcon
                class="
                  size-6
                  text-maree-darker-accent
                "
              />
            </div>
          </div>
        </label>
      {/each}
    </div>
    <div
      class="
        lg:flex-[0_0_400px]
        grid
        w-full
        max-w-[400px]
      "
    >
      <InputFile
        onInput={onInputMedia}
        label="أدخل الوسيطة"
      />
      <Button
        onclick={onUpload}
        type="solid"
        color="secondary"
        disabled={filesReady.length < 1}
        label="التحميل"
      />
    </div>
  </div>
  <div>
    <div
      class="
        flex
        flex-wrap
        justify-center
        gap-5
      "
    >
      {#each filesReady as file, i (i)}
        <div
          class="
            flex-[0_1_300px]
            p-4
            bg-maree-dark-accent
            text-maree-accent
            rounded-lg
          "
        >
          <div
            class="
              flex
              items-center
            "
          >
            {JSON.stringify(file.meta.upload)}
            <p
              class="
                h-[80px]
                text-xl
                overflow-hidden
                line-clamp-3
              "
            >
              {file.file.name}
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
          <div
            class="
              h-[2px]
              my-3
              bg-maree-accent
            "
          ></div>
          <div
            class="
              grid
              grid-rows-3
              gap-2
            "
          >
            {#each file.meta.options as option (option.name)}

                <label
                  class="
                    row-span-1
                  "
                >
                  <div
                    class="
                      relative
                    "
                  >
                    <select
                      bind:value={
                        () => file.meta[option.type],
                        (v) => setEachFileValue(v, file, option)
                      }
                      class="
                        w-full
                        p-3
                        bg-maree-accent
                        text-xl
                        text-maree-darker-accent
                        rounded-xl
                        appearance-none
                      "
                    >
                      {#each option.options as type (type.value)}
                        <option value={type.value}>{type.name}</option>
                      {/each}
                    </select>
                    <div
                      class="
                        grid
                        place-content-center
                        absolute
                        top-0
                        left-0
                        h-full
                        w-12
                      "
                    >
                      <ChevronDownIcon
                        class="
                          size-6
                          text-maree-darker-accent
                        "
                      />
                    </div>
                  </div>
                </label>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>