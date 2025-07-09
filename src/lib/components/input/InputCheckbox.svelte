<script>
  let {
    checked = $bindable(false),
    label = null,
    name = 'checkbox',
    class: className = ''
  } = $props();
</script>

<label
  class="
    flex
    items-center
    mr-2
    text-maree-secondary
    font-medium
    {className}
  "
>
  <input
    type="checkbox"
    {name}
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
  {#if label}
    <p>{label}</p>
  {/if}
</label>