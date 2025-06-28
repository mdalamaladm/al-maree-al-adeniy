<script>
	import Button from "../Button.svelte";
	import Table from "../Table.svelte";
	import AddAudioPage from "./AddAudioPage.svelte";

  let { audios, options } = $props();

  let isAddPage = $state(false);

  let columns = [
    {
      name: 'رقم الملف',
      key: 'id'
    },
    {
      name: 'اسم الملف',
      key: 'name'
    },
    {
      name: 'رمز الملف',
      key: 'key'
    },
    {
      name: 'الوسيطة',
      key: 'mediaId'
    },
    {
      name: 'النوع',
      key: 'typeId'
    },
    {
      name: 'الموصوع',
      key: 'contentId'
    }
  ];
</script>

{#if isAddPage}
  <AddAudioPage
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
        onclick={() => isAddPage = true}
        type="solid"
        color="secondary"
        label="الإضافة"
      />
    </div>
    <Table
      {columns}
      rows={audios}
    />
  </div>
{/if}