export let modal = $state({
  data: [],
  open (content, props) {
    const id = crypto.randomUUID();

    modal.data.push({ id, content, props });
  },
  close (id) {
    modal.data = modal.data.filter(d => d.id !== id);
  }
})