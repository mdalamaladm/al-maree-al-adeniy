export let loader = $state({
  open: false,
  message: '',
  start (message) {
    loader.message = message;
    loader.open = true;
  },
  end () {
    loader.open = false;
    loader.message = '';
  }
})