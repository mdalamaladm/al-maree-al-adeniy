<script>
	import PencilIcon from "$lib/icons/PencilIcon.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import Button from "../Button.svelte";
	import Table from "../Table.svelte";
  import { modal } from "../modal.svelte";

  let { types, loadTypes } = $props();

  let columns = [
    {
      name: 'اسم النوع',
      key: 'name'
    },
    {
      slot: 'action',
      align: 'center',
      width: '100px'
    }
  ];

  let form = $state([
    {
      name: 'id',
      value: null,
      noInput: true,
    },
    {
      name: 'name',
      type: 'text',
      label: 'اسم النوع',
      value: null,
    },
  ])

  async function onDelete(close, id) {
    await fetch(`/api/type/${id}`, {
      method: 'DELETE',
    });

    close()

    await loadTypes();
  }

  async function onSubmitCreate(close, clearForm, formValue) {
    await fetch('/api/type', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formValue.name,
      })
    });

    clearForm();
    close();

    await loadTypes();
  }

  async function onSubmitUpdate(close, clearForm, formValue) {
    await fetch(`/api/type/${formValue.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formValue.name,
      })
    });

    clearForm();
    close();

    await loadTypes();
  }
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
        submitLabel: 'OK',
        cancelLabel: 'إلغاء',
        onSubmit: onSubmitCreate,
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
      {#if name === 'action'}
        <div
          class="
            flex
            items-center
          "
        >
          <PencilIcon
            onclick={() => {
              form[0].value = data.id;
              form[1].value = data.name;

              modal.form.open({
                form,
                submitLabel: 'OK',
                cancelLabel: 'إلغاء',
                onSubmit: onSubmitUpdate,
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
              message: `تأكدت حذف نوع (${data.name})؟`,
              confirmLabel: 'نعم',
              cancelLabel: 'لا',
              onConfirm: (close) => onDelete(close, data.id)
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