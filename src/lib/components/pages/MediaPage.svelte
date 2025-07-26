<script>
	import PencilIcon from "$lib/icons/PencilIcon.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import Button from "../Button.svelte";
	import Table from "../Table.svelte";
  import { modal } from "../modal.svelte";

  let { medias } = $props();

  let columns = [
    {
      name: 'اسم وسيطة',
      key: 'name'
    },
    {
      name: 'لقب وسيطة',
      key: 'alias',
    },
    {
      name: 'أنواع',
      slot: 'types',
      width: '300px',
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
      width: '100px'
    }
  ];

  let form = $state([
    {
      name: 'name',
      type: 'text',
      label: 'اسم وسيطة',
      value: null,
    },
    {
      name: 'alias',
      type: 'text',
      label: 'لقب وسيطة',
      value: null
    },
  ])
</script>

<div>
  <div
    class="
      flex
      justify-end
      mb-5
    "
  >
    <Button
      onclick={() => modal.form.open({
        form,
        formAction: '?/createMedia',
        submitLabel: 'OK',
        cancelLabel: 'إلغاء',
      })}
      type="solid"
      color="secondary"
      label="إضافة"
    />
  </div>
  <Table
    {columns}
    rows={medias}
  >
    {#snippet slot(name, data)}
      {#if name === 'types'}
        {data.types.map(t => t.name).join(', ')}
      {:else if name === 'action' && !(data.alias === 'none' || data.alias === 'audio' || data.alias === 'video')}
        <div
          class="
            flex
            items-center
          "
        >
          <PencilIcon
            onclick={() => {
              form[0].value = data.name;
              form[1].value = data.alias;

              modal.form.open({
                form,
                formAction: `?/editMedia&${new URLSearchParams({ id: data.alias })}`,
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
              formAction: `?/deleteMedia&${new URLSearchParams({ id: data.alias })}`,
              message: `تأكدت حذف وسيطة (${data.name})؟`,
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
      {:else if name === 'isLecture'}
        {data.isLecture ? 'نعم' : 'لا'}
      {/if}
    {/snippet}
  </Table>
</div>