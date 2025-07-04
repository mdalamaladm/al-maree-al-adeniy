<script>
	import PencilIcon from "$lib/icons/PencilIcon.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import Button from "../Button.svelte";
	import Table from "../Table.svelte";
  import { modal } from "../modal.svelte";

  let { contents, loadContents } = $props();

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
      label: 'اسم الموضوع',
      value: null,
    },
    {
      name: 'isLecture',
      type: 'checkbox',
      label: 'خاص للدروس',
      value: false,
    }
  ])

  async function onDelete(close, id) {
    await fetch(`/api/content/${id}`, {
      method: 'DELETE',
    });

    close()

    await loadContents();
  }

  async function onSubmitCreate(close, clearForm, formValue) {
    await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formValue.name,
        isLecture: formValue.isLecture,
      })
    });

    clearForm();
    close();

    await loadContents();
  }

  async function onSubmitUpdate(close, clearForm, formValue) {
    await fetch(`/api/content/${formValue.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formValue.name,
        isLecture: formValue.isLecture,
      })
    });

    clearForm();
    close();

    await loadContents();
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
    rows={contents}
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
              form[2].value = data.isLecture;

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
              message: `تأكدت حذف موضوع (${data.name})؟`,
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