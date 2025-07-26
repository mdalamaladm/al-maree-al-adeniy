<script>
	import { goto } from "$app/navigation";
	import PencilIcon from "$lib/icons/PencilIcon.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import Button from "../Button.svelte";
	import InputSelect from "../input/InputSelect.svelte";
	import { modal } from "../modal.svelte";
	import Table from "../Table.svelte";
	import AddFilePage from "./AddFilePage.svelte";

  let { auth, files, isAddFilePage, options } = $props();

  let columns = [
    {
      name: 'اسم ملف',
      key: 'name'
    },
    {
      name: 'امتداد ملف',
      key: 'extension'
    },
    {
      name: 'وسيطة',
      key: 'media.name'
    },
    {
      name: 'نوع',
      key: 'type.name'
    },
    {
      name: 'موصوع',
      key: 'content.name'
    },
    {
      name: 'تاريخ صناعة',
      key: 'createdAt'
    },
    {
      name: 'تاريخ تعديل',
      key: 'updatedAt'
    },
    {
      name: 'فاعل صناعة',
      key: 'createdBy'
    },
    {
      name: 'فاعل تعديل',
      key: 'updatedBy'
    },
    {
      slot: 'action',
      align: 'center',
      width: '100px',
    }
  ];

  let form = $derived([
    {
      name: 'name',
      type: 'text',
      label: 'اسم ملف',
      value: null,
    },
    {
      name: 'extension',
      type: 'text',
      label: 'امتداد ملف',
      value: null,
    },
    {
      name: 'mediaId',
      type: 'select',
      label: 'وسيطة',
      options: options.medias,
      value: null
    },
    {
      name: 'typeId',
      type: 'snippet',
      label: 'نوع',
      options: options.types,
      value: null,
      snippet: typeSelect
    },
    {
      name: 'contentId',
      type: 'snippet',
      label: 'موضوع',
      options: options.contents,
      value: null,
      snippet: contentSelect
    },
  ]);

</script>

{#snippet typeSelect (input, form)}
<InputSelect
  onchange={(e) => {
    if (e.target.value === 'durus') form[4].value = options.contents.filter(e => e.isLecture || e.value === 1)[0].value;
    else form[4].value = options.contents.filter(e => !e.isLecture)[0].value
  }}
  label={input.label}
  name={input.name}
  options={input.options}
  bind:value={input.value}
  class="
    mb-5
  "
/>
{/snippet}

{#snippet contentSelect(input, form)}
  {#if form[3].value === 'durus'}
    <InputSelect
      label={input.label}
      name={input.name}
      options={input.options.filter(e => e.isLecture || e.value === 1)}
      bind:value={input.value}
      class="
        mb-5
      "
    />
  {:else}
    <InputSelect
      label={input.label}
      name={input.name}
      options={input.options.filter(e => !e.isLecture)}
      bind:value={input.value}
      class="
        mb-5
      "
    />
  {/if}
{/snippet}
  
{#if isAddFilePage}
  <AddFilePage
    {auth}
    {options}
  />
{:else}
  <div>
    <div
      class="
        flex
        justify-end
        mb-5
      "
    >
      <Button
        onclick={() => {
          goto(`/admin/manage?${new URLSearchParams({ tab: 'add-file' })}`);
        }}
        type="solid"
        color="secondary"
        label="إضافة"
      />
    </div>
    <Table
      {columns}
      rows={files}
    >
      {#snippet slot(name, data)}
        {#if name === 'action'}
          <div
            class="
              flex
              items-center
            "
          >
            <PencilIcon
              onclick={() => {
                form[0].value = data.name;
                form[1].value = data.extension;
                form[2].value = data.mediaId;
                form[3].value = data.typeId;
                form[4].value = data.contentId;

                modal.form.open({
                  form,
                  formAction: `?/editFile&${new URLSearchParams({ id: data.id })}`,
                  submitLabel: 'OK',
                  cancelLabel: 'إلغاء',
                });
              }}
              class="
                size-8
                text-maree-secondary
                cursor-pointer
              "
            />
            <TrashIcon
              onclick={() => modal.confirm.open({
                formAction: `?/deleteFile&${new URLSearchParams({ id: data.id })}`,
                message: `تأكدت حذف ملف (${data.name})؟`,
                confirmLabel: 'نعم',
                cancelLabel: 'لا',
              })}
              class="
                mr-5
                size-8
                text-red-500
                cursor-pointer
              "
            />
          </div>
        {/if}
      {/snippet}
    </Table>
  </div>
{/if}