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
      name: 'اسم الملف',
      key: 'name'
    },
    {
      name: 'الوسيطة',
      key: 'media.name'
    },
    {
      name: 'النوع',
      key: 'type.name'
    },
    {
      name: 'الموصوع',
      key: 'content.name'
    },
    {
      name: 'تاريخ الصناعة',
      key: 'createdAt'
    },
    {
      name: 'تاريخ التعديل',
      key: 'updatedAt'
    },
    {
      name: 'فاعل الصناعة',
      key: 'createdBy'
    },
    {
      name: 'فاعل التعديل',
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
      label: 'اسم الملف',
      value: null,
    },
    {
      name: 'mediaId',
      type: 'select',
      label: 'الوسيطة',
      options: options.medias,
      value: null
    },
    {
      name: 'typeId',
      type: 'select',
      label: 'النوع',
      options: options.types,
      value: null
    },
    {
      name: 'contentId',
      type: 'snippet',
      label: 'الموضوع',
      value: null,
      snippet: contentSelect
    },
  ]);

</script>

{#snippet contentSelect(input, form)}
  {#if form[2].value === 4}
    <InputSelect
      label={input.label}
      name={input.name}
      options={options.contents.filter(e => e.isLecture || e.value === 1)}
      bind:value={input.value}
      class="
        mb-5
      "
    />
  {:else}
    <InputSelect
      label={input.label}
      name={input.name}
      options={options.contents.filter(e => !e.isLecture)}
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
                form[1].value = data.mediaId;
                form[2].value = data.typeId;
                form[3].value = data.contentId;

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