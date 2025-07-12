<script>
	import { goto } from "$app/navigation";
	import InputFile from "$lib/components/input/InputFile.svelte";
	import ArrowPathIcon from "$lib/icons/ArrowPathIcon.svelte";
	import CloseIcon from "$lib/icons/CloseIcon.svelte";
	import Button from "../Button.svelte";
	import InputSelect from "../input/InputSelect.svelte";
	import { modal } from "../modal.svelte";

  let { options, isUploading = $bindable(false) } = $props();

  let typeValue = $state({
    media: undefined,
    type: undefined,
    content: undefined,
  });

  let uploadListButtonClass = $state('');

  let contentOptions = $derived.by(() => {
    if (typeValue.type === 4) return options.contents.filter(e => e.isLecture || e.value === 1);
    else return options.contents.filter(e => !e.isLecture);
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
      options: contentOptions
    }
  ]);

  let filesReady = $state([]);
  let filesUpload = $state([]);
  let order = $state(0);

  let isProgressing = $derived.by(() => {
    return !!filesUpload.find(f => f.meta.status === 'progress');
  })

  function setGlobalValue (v, option) {
    typeValue[option.type] = v;

    if (option.type === 'media') {
      typeValue.type = options.types[0].value;
      typeValue.content = options.contents.filter(e => !e.isLecture)[0].value;
    } else if (option.type === 'type') {
      if (v === 4) {
        typeValue.content = options.contents.filter(e => e.isLecture || e.value === 1)[0].value;
      } else {
        typeValue.content = options.contents.filter(e => !e.isLecture)[0].value;
      }
    }
  }

  function setEachFileValue (v, file, option) {
    file.meta[option.type] = v;

    if (option.type === 'media') {
      file.meta.type = options.types[0].value;
      file.meta.options[2].options = options.contents.filter(e => !e.isLecture);
      file.meta.content = options.contents.filter(e => !e.isLecture)[0].value;
    } else if (option.type === 'type') {
      if (v === 4) {
        file.meta.options[2].options = options.contents.filter(e => e.isLecture || e.value === 1);
        file.meta.content = options.contents.filter(e => e.isLecture || e.value === 1)[0].value;
      } else {
        file.meta.options[2].options = options.contents.filter(e => !e.isLecture);
        file.meta.content = options.contents.filter(e => !e.isLecture)[0].value;
      }
    }
  }

  function onInputFiles (e) {
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
            options: options.contents.filter(e => !e.isLecture)
          }
        ],
      },
      file: f
    }))

    filesReady.push(...mapped);
  }

  function onRemoveFile (i) {
    filesReady = filesReady.filter((_, index) => index !== i);
  }

  async function onUpload () {
    filesUpload = filesUpload.concat([...filesReady]);
    filesReady = [];

    filesUpload.forEach((f, i) => {
      if (f.meta.status === 'ready') {
        f.meta.status = 'wait';
        f.meta.upload = () => {
          order = i;
          f.meta.status = 'wait';
          isUploading = true;
        };
        f.meta.abort = () => {
          if (f.meta?.xhr) f.meta.xhr.abort();
          else {
            f.meta.status = 'abort';
            orderIncrement();
          }
      };
      }
    });

    uploadListButtonClass = 'animate-upload-pulse';
    setTimeout(() => uploadListButtonClass = '', 2000);

    isUploading = true;
  }

  async function eachFileUpload() {
    const file = filesUpload[order];

    try {
      file.meta.status = 'wait';

      if (!isProgressing) {
        const resUploadPresigned = await fetch(`/api/admin/file/upload/presigned`);

        const { key, presigned } = await resUploadPresigned.json();

        const success = await uploadXHR({
          url: presigned,
          file,
          onProgress: (event) => {
            file.meta.status = 'progress';
            file.meta.progress = Math.round((event.loaded / event.total) * 100);
          },
          onError: () => {
            file.meta.status = 'error';
          },
          onAbort: () => {
            file.meta.status = 'abort';
          }
        });

        if (success) {
          const payload = {
            name: file.file.name,
            key,
            mediaId: file.meta.media,
            typeId: file.meta.type,
            contentId: file.meta.content,
          };

          await fetch('/api/admin/file', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          file.meta.status = 'complete';
        }
      }
    } catch(e) {
      console.error(e);

      if (e.message !== 'Network aborted') {
        file.meta.status = 'error';
      }
    } finally {
      orderIncrement();
    }
  }

  function uploadXHR ({
    url,
    file,
    onProgress = () => {},
    onSuccess = (_, resolve) => resolve(true),
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
          onSuccess(
            xhr,
            resolve
          );
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
    const index = filesUpload.findIndex(f => f.meta.status === 'wait');

    if (index > -1) {
      order = index;
    } else {
      order = filesUpload.length;
    }
  }

  function formattedFilename (name) {
    const splitted = name.split('.');
    const extension = splitted.pop();
    let filename = splitted.join('.');

    if (filename.length > 50) {
      filename = `${filename.slice(0, 50)}...`
    }
    return `${filename}.${extension}`
  }

  function onBeforeClose (e) {
    if (isUploading) {
      e.preventDefault();

      e.returnValue = 'Are you sure you want to leave? Your changes may not be saved.';
    }
  }

  function goBack () {
    if (isUploading) {
      const confirm = window.confirm('Are you sure you want to leave? Your changes may not be saved.');

      if (confirm) {
        abortAll();

        goto(`/admin/manage?${new URLSearchParams({ tab: 'file' })}`);
      }
    } else goto(`/admin/manage?${new URLSearchParams({ tab: 'file' })}`);
  }

  function abortAll () {
    filesUpload.forEach(f => {
      f.meta.abort();
    });
  }

  $effect(() => {
    if (isUploading) {
      if (order < filesUpload.length) {
        if (!isProgressing) {
          eachFileUpload();
        }
      } else {
        isUploading = false;
      }
    }
  });
</script>

<svelte:window onbeforeunload={onBeforeClose} />

{#snippet uploadList(close)}
  <div
    class="
      h-full
    "
  >
    <div
      class="
        p-5
      "
    >
      <Button
        onclick={close}
        type="solid"
        color="secondary"
        label="إغلاق"
      />
    </div>
    <div
      class="
        flex
        flex-wrap
        items-start
        justify-center
        gap-5
        h-[calc(100%_-_112px)]
        overflow-y-auto
      "
    >
      {#each filesUpload as file, i (i)}
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
                  h-[60px]
                  text-xl
                "
              >
                {formattedFilename(file.file.name)}
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
                    row-span-1
                    p-2
                    bg-maree-accent
                    text-lg
                    text-maree-darker-accent
                    rounded-xl
                  "
                >
                  {option.options.find((o) => o.value === file.meta[option.type]).name}
                </div>
              {/each}
              </div>
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
                      file.meta.abort();
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
        {/each}
    </div>
  </div>
{/snippet}

<section>
  <div
    class="
      flex
      items-center
      justify-between
    "
  >
    <Button
      onclick={goBack}
      type="solid"
      color="secondary"
      label="رجوع"
    />
    <Button
      onclick={() => modal.open(uploadList, { center: false, className: 'w-full h-full bg-white' })}
      type="solid"
      color="secondary"
      label="التحميلات"
      class="
        box-border
        border-4
        border-transparent
        {uploadListButtonClass}
      "
    />
  </div>
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
        <InputSelect
          label={option.name}
          options={option.options}
          getter={() => typeValue[option.type]}
          setter={(v) => setGlobalValue(v, option)}
          class="
            row-span-1
          "
        />
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
        onInput={onInputFiles}
        label="إدراج الملفات"
      />
      <Button
        onclick={onUpload}
        type="solid"
        color="secondary"
        disabled={filesReady.length < 1}
        label="تحميل"
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
            <p
              class="
                h-[80px]
                text-xl
              "
            >
              {formattedFilename(file.file.name)}
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
              <InputSelect
                options={option.options}
                getter={() => file.meta[option.type]}
                setter={(v) => setEachFileValue(v, file, option)}
                class="
                  row-span-1
                "
              />
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>