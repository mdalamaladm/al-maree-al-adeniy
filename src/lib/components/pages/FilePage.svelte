<script>
	import Table from "../Table.svelte";

  let { files } = $props();

  let columns = [
    {
      name: 'اسم اللف',
      key: 'name'
    },
    {
      name: 'رقم الملف',
      key: 'id'
    }
  ];
</script>

<div>
  <Table
    {columns}
    rows={files}
  />
</div>