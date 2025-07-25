<script>
	import PencilIcon from "$lib/icons/PencilIcon.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import Button from "../Button.svelte";
	import Table from "../Table.svelte";
  import { modal } from "../modal.svelte";

  let { contents } = $props();

  let columns = [
    {
      name: 'اسم الموضوع',
      key: 'name'
    },
    {
      name: 'خاص للدروس',
      key: 'isLecture',
      slot: 'isLecture'
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
      label: 'اسم الموضوع',
      value: null,
    },
    {
      name: 'isLecture',
      type: 'checkbox',
      label: 'خاص للدروس',
      value: false,
    }
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
        formAction: '?/createContent',
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
    rows={contents}
  >
    {#snippet slot(name, data)}
      {#if name === 'action' && data.id !== 1}
        <div
          class="
            flex
            items-center
          "
        >
          <PencilIcon
            onclick={() => {
              form[0].value = data.name;
              form[1].value = data.isLecture;

              modal.form.open({
                form,
                formAction: `?/editContent&${new URLSearchParams({ id: data.id })}`,
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
              formAction: `?/deleteContent&${new URLSearchParams({ id: data.id })}`,
              message: `تأكدت حذف موضوع (${data.name})؟`,
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