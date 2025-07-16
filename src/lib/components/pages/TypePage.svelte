<script>
	import PencilIcon from "$lib/icons/PencilIcon.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import Button from "../Button.svelte";
	import Table from "../Table.svelte";
  import { modal } from "../modal.svelte";

  let { types } = $props();

  let columns = [
    {
      name: 'اسم النوع',
      key: 'name'
    },
    {
      name: 'لقب النوع',
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
      label: 'اسم النوع',
      value: null,
    },
    {
      name: 'alias',
      type: 'text',
      label: 'لقب النوع',
      value: null
    },
  ]);
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
        formAction: '?/createType',
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
    rows={types}
  >
    {#snippet slot(name, data)}
      {#if name === 'action' && !(data.alias === 'none' || data.alias === 'muhadharat' || data.alias === 'khuthab' || data.alias === 'durus' || data.alias === 'fatawa')}
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
                formAction: `?/editType&${new URLSearchParams({ id: data.alias })}`,
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
              formAction: `?/deleteType&${new URLSearchParams({ id: data.alias })}`,
              message: `تأكدت حذف نوع (${data.name})؟`,
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