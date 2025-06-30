<script>
	import InputFile from "$lib/components/input/InputFile.svelte";
	import ArrowPathIcon from "$lib/icons/ArrowPathIcon.svelte";
	import ChevronDownIcon from "$lib/icons/ChevronDownIcon.svelte";
	import CloseIcon from "$lib/icons/CloseIcon.svelte";

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

  let isProgressing = $derived.by(() => {
    return !!files.find(f => f.meta.status === 'progress');
  })

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
        status: 'wait',
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
    isUploading = true;
  }

  async function eachFileUpload(order, fileParam, uploadParam) {
    console.log('NYAMBUNG?');
    const fiveMB = 5_000_000;

    const file = fileParam || files[order];
  
    const payload = uploadParam || {
      key: `${mapMedias.get(file.meta.media)}/${mapTypes.get(file.meta.type)}/${file.file.name}`,
      fileSize: file.file.size,
    };
    
    file.meta.upload = () => eachFileUpload(order, file, payload);
    file.meta.status = 'wait';

    if (!isProgressing) {
      const resUploadPresigned = await fetch(`/api/file/upload-presigned?key=${payload.key}`);

      const uploadPresigned = await resUploadPresigned.text();

      console.log(uploadPresigned);

      await uploadXHR(uploadPresigned, file);

      orderIncrement();
    }

    // const resUpload = await fetch(uploadPresigned, {
    //   method: 'PUT',
    //   body: file.file,
    //   headers: {
    //     'Content-Type': 'application/octet-stream'
    //   }
    // });

    // console.log('HAI');

    // console.log('UPLOAD', await resUpload.json());

    // const resPresignedUrls = await fetch('/api/file/multipart-upload-presigned', {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // });

    // const presignedUrls = await resPresignedUrls.json();

    // const numberOfParts = Math.ceil(file.file.size / fiveMB);

    // const uploads = [];

    // for (let i = 0; i < numberOfParts; i++) {
    //   const start = i * fiveMB;
    //   const end = Math.min(start + fiveMB, file.file.size);
    //   const blob = file.file.slice(start, end);

    //   console.log('BLOB', blob)

    //   uploads.push(uploadPart(blob, presignedUrls[i], i + 1));
    // }

    // const uploadResponses = await Promise.all(uploads);

    // console.log(`RESULT FOR ${file.file.name}`, uploadResponses);
  }

  async function uploadPart (fileChunk, presignedUrl, partNo) {
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: fileChunk
    });

    return {
      value: {
        ETag: uploadResponse.headers.get('ETag') ?? '',
        PartNo: partNo
      }
    };
  }

  function uploadXHR (url, file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      file.meta.xhr = xhr;

      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          file.meta.status = 'progress'
          const progress = Math.round((event.loaded / event.total) * 100);

          file.meta.progress = progress
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          file.meta.status = 'complete';
          const response = JSON.parse(xhr.responseText);
          
          resolve(response);
        } else {
          file.meta.status = 'error';
          reject(new Error(`HTTP error! Status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        file.meta.status = 'error';
        orderIncrement();
        reject(new Error('Network error occured'));
      });

      xhr.addEventListener('abort', () => {
        file.meta.status = 'abort';
        orderIncrement();
        reject(new Error('Network aborted'));
      });

      xhr.open('PUT', url, true);
      xhr.send(file.file);
      console.log('UPLOAD XHR');
      return;

    })
  }

  function orderIncrement() {
    const index = files.findIndex(f => f.meta.status === 'wait');

    console.log(index);

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
          console.log('ISUPLOADING', isUploading);
          console.log('ORDER', order);
          console.log('=====');
          eachFileUpload(order);
        }
      }
    }
  });
</script>



<section>
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
      <button
        onclick={onUpload}
        disabled={files.length < 1}
        class="
          grid
          place-content-center
          p-5
          bg-maree-secondary
          text-maree-accent
          text-xl
          rounded-lg
          cursor-pointer
        "
      >
        التحميل
      </button>
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
      {#each files as file, i (i)}
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
            {#if !isUploading}
              <CloseIcon
                onclick={() => onRemoveFile(i)}
                class="
                  size-8
                  flex-none
                  mr-5
                  cursor-pointer
                "
              />
            {/if}
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
              {#if isUploading}
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
              {:else}
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
              {/if}
            {/each}
            {#if isUploading}
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
                      onclick={() => file.meta.xhr.abort()}
                      class="
                        size-8
                        cursor-pointer
                      "
                    />
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>