<script>
	import PencilIcon from "$lib/icons/PencilIcon.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import Button from "../Button.svelte";
	import Table from "../Table.svelte";
  import { modal } from "../modal.svelte";

  let { medias } = $props();

  let columns = [
    {
      name: 'اسم الوسيطة',
      key: 'name'
    },
    {
      name: 'لقب الوسيطة',
      key: 'alias',
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
      width: '100px'
    }
  ];

  let form = $state([
    {
      name: 'name',
      type: 'text',
      label: 'اسم الوسيطة',
      value: null,
    },
    {
      name: 'alias',
      type: 'text',
      label: 'لقب الوسيطة',
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
      label="الإضافة"
    />
  </div>
  <Table
    {columns}
    rows={medias}
  >
    {#snippet slot(name, data)}
      {#if name === 'action' && !(data.id === 1 || data.id === 2 || data.id === 3)}
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
                formAction: `?/editMedia&${new URLSearchParams({ id: data.id })}`,
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
              formAction: `?/deleteMedia&${new URLSearchParams({ id: data.id })}`,
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