<script>
  let { open = $bindable(false), children } = $props();

  function onCloseModal (e) {
    if (e.target.classList.contains('the-overlay')) open = false;
  }
</script>

{#if open}
  <div
    onclick={onCloseModal}
    class="
      the-overlay
      fixed
      w-full
      min-h-full
      p-10
      inset-0
      z-50
      bg-gray-500/75
      transition-opacity
    "
  >
  {@render children?.()}
  </div>
{/if}