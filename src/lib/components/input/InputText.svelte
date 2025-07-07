<script>
  let {
    onInput = () => {},
    value = $bindable(''),
    placeholder = null,
    label = null,
    name = 'text',
    class: className = '',
  } = $props();
</script>

<label
  class="
    block
    {className}
  "
>
  {#if label}
    <p
      class="
        mb-2
        text-maree-secondary
        font-medium
      "
    >
      {label}
    </p>
  {/if}
  <input
    class="
      w-full
      p-2
      bg-maree-accent
      text-xl
      font-medium
      rounded-xl
    "
    type="text"
    name={name}
    placeholder={placeholder}
    oninput={(e) => onInput(e)}
    bind:value
  >
</label>