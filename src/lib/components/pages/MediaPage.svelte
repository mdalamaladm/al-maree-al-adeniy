<script>
	import Table from "../Table.svelte";

  let { medias } = $props();

  let columns = [
    {
      name: 'اسم الوسيطة',
      key: 'name'
    },
    {
      name: 'رقم الوسيطة',
      key: 'id'
    }
  ];
</script>

<div>
  <Table
    {columns}
    rows={medias}
  />
</div>