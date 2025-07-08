<script>
  let {
    open = $bindable(false),
    center = false,
    children,
    onClose = () => {}
  } = $props();
</script>

{#if open}
  <div
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
      {center ? 'grid place-content-center' : ''}
    "
  >
  {@render children?.()}
  </div>
{/if}