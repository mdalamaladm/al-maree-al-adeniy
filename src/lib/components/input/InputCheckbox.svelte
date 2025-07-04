<script>
  let{ checked = $bindable(false), label } = $props();
</script>

<label
  class="
    flex
    items-center
    mr-2
    text-maree-secondary
    font-medium
  "
>
  <input
    type="checkbox"
    bind:checked
    class="
      w-5
      h-5
      ml-2
      border-2
      border-maree-darker-accent
      bg-maree-darker-accent
    "
  >
  <p>{label}</p>
</label>