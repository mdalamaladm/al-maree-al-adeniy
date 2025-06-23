<script>
  let { onInput = () => {}, value = $bindable(''), placeholder = null, label = null, class: className = '' } = $props();
</script>

<label
  class="
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
      text-maree-darker-accent
      font-medium
      rounded-xl
    "
    type="text"
    placeholder={placeholder}
    oninput={(e) => onInput(e)}
    bind:value
  >
</label>