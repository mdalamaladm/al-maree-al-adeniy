<script>
	import PencilIcon from "$lib/icons/PencilIcon.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import Button from "../Button.svelte";
	import Table from "../Table.svelte";
  import { modal } from "../modal.svelte";

  let { medias, loadMedias } = $props();

  let columns = [
    {
      name: 'اسم الوسيطة',
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
      label: 'اسم الوسيطة',
      value: null,
    },
  ])

  async function onDelete(close, id) {
    await fetch(`/api/media/${id}`, {
      method: 'DELETE',
    });

    close()

    await loadMedias();
  }

  async function onSubmitCreate(close, clearForm, formValue) {
    await fetch('/api/media', {
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

    await loadMedias();
  }

  async function onSubmitUpdate(close, clearForm, formValue) {
    await fetch(`/api/media/${formValue.id}`, {
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

    await loadMedias();
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
              message: `تأكدت حذف وسيطة (${data.name})؟`,
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
      {:else if name === 'isLecture'}
        {data.isLecture ? 'نعم' : 'لا'}
      {/if}
    {/snippet}
  </Table>
</div>