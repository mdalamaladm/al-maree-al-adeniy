<script>
	import Table from "../Table.svelte";

  let { types } = $props();

  let columns = [
    {
      name: 'اسم النوع',
      key: 'name'
    },
    {
      name: 'رقم النوع',
      key: 'id'
    }
  ];
</script>

<div>
  <Table
    {columns}
    rows={types}
  />
</div>