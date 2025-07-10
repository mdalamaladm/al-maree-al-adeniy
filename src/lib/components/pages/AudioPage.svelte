<script>
	import { goto } from "$app/navigation";
	import PencilIcon from "$lib/icons/PencilIcon.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import Button from "../Button.svelte";
	import { modal } from "../modal.svelte";
	import Table from "../Table.svelte";
	import AddAudioPage from "./AddAudioPage.svelte";

  let { audios, loadAudios, options } = $props();

  let isAddPage = $state(false);

  let columns = [
    {
      name: 'اسم الصوتية',
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
      slot: 'action',
      align: 'center',
      width: '100px',
    }
  ];

  let form = $state([
    {
      name: 'name',
      type: 'text',
      label: 'اسم الصوتية',
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
      setter: (v, value) => {
        if(v === 4) form[3].options = options.lectures;
        else form[3].options = options.others;

        value = v;
      },
      value: null
    },
    {
      name: 'contentId',
      type: 'select',
      label: 'الموضوع',
      options: options.others,
      value: null
    },
  ]);


  $effect.pre(() => {
    const urlParams = new URLSearchParams(window.location.search);
    isAddPage = urlParams.get('add') === 'true';
  })
</script>

{#if isAddPage}
  <AddAudioPage
    {options}
    {loadAudios}
    bind:isAddPage
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
          goto(`/admin/manage?${new URLSearchParams({ tab: 'file', add: 'true' })}`);
          isAddPage = true;
        }}
        type="solid"
        color="secondary"
        label="الإضافة"
      />
    </div>
    <Table
      {columns}
      rows={audios}
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
              formAction: `?/deletFileType&${new URLSearchParams({ id: data.id })}`,
                message: `تأكدت حذف صوتية (${data.name})؟`,
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