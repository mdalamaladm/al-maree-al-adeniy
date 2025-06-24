<script>
	import Table from "../Table.svelte";

  let { contents } = $props();

  let columns = [
    {
      name: 'اسم الموضوع',
      key: 'name'
    },
    {
      name: 'رقم الموضوع',
      key: 'id'
    },
    {
      name: 'خاص للدروس',
      key: 'isLecture'
    }
  ];
</script>

<div>
  <Table
    {columns}
    rows={contents.map(c => ({ ...c, isLecture: c.isLecture ? 'نعم' : 'لا' }))}
  />
</div>