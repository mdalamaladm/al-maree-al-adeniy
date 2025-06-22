<script>
	import InputFile from "$lib/components/InputFile.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
	import ChevronDownIcon from "$lib/icons/ChevronDownIcon.svelte";
	import CloseIcon from "$lib/icons/CloseIcon.svelte";
  
  let open = $state(false);

  let typeValue = $state({
    file: 1,
    type: 1,
    content: 1,
  })

  let fileTypeOptions = [
    {
      name: 'صوتبة',
      value: 1,
    },
    {
      name: 'فيديو',
      value: 2,
    }
  ];

  let typeOptions = [
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
  ];

  let otherTypeOptions = [
    {
      name: 'العقيدة والتوحيد',
      value: 1,
    },
    {
      name: 'الآداب والأخلاق',
      value: 2
    },
  ];

  let lectureTypeOptions = [
    {
      name: 'كتاب التوحيد',
      value: 1,
    },
    {
      name: 'صحيح البخاري',
      value: 2
    }
  ];

  let contentTypeOptions = $derived.by(() => {
    if (typeValue.type === 3) return lectureTypeOptions;
    else return otherTypeOptions;
  });

  let globalOptions = $derived([
    {
      name: 'الملف',
      type: 'file',
      options: fileTypeOptions
    },
    {
      name: 'النوع',
      type: 'type',
      options: typeOptions
    },
    {
      name: 'الموضوع',
      type: 'content',
      options: contentTypeOptions
    }
  ])

  let files = $state([]);

  function onInputFile (e) {
    const mapped = Array.from(e.target.files).map((f) => ({
      meta: {
        file: typeValue.file,
        type: typeValue.type,
        content: typeValue.content,
        options: [
          {
            name: 'الملف',
            type: 'file',
            options: fileTypeOptions
          },
          {
            name: 'النوع',
            type: 'type',
            options: typeOptions
          },
          {
            name: 'الموضوع',
            type: 'content',
            options: otherTypeOptions
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
                (v) => {
                  typeValue[option.type] = v;

                  if (option.type === 'file') {
                    typeValue.type = 1;
                  } else if (option.type === 'type') {
                    typeValue.content = 1;
                  }
                }
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
        onInput={onInputFile}
        label="أدخل الملف"
      />
      <button
        onclick={() => open = true}
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
                      (v) => {
                        file.meta[option.type] = v;

                        if (option.type === 'file') {
                          file.meta.type = 1;
                        } else if (option.type === 'type') {
                          file.meta.content = 1;
                          if (v === 3) {
                            file.meta.options[2].options = lectureTypeOptions;
                          } else {
                            file.meta.options[2].options = otherTypeOptions;
                          }
                        }
                      }
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