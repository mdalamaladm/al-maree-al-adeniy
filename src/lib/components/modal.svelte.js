import { v4 as uuidv4 } from 'uuid';

export let modal = $state({
  data: [],
  open (content, props) {
    const id = uuidv4();

    modal.data.push({ id, content, props });
  },
  close (id) {
    modal.data = modal.data.filter(d => d.id !== id);
  }
})