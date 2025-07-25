<script>
  let { items = [], onchange = (i, value) => value = i, value = $bindable(0) } = $props();

  function onClickTab(i) {
    onchange(i);
  }
</script>

<div>
  <div
    class="
      flex
    "
  >
    {#each items as item, i (i)}
      <button
        onclick={() => onClickTab(i)}
        class="
          px-5
          py-3
          text-xl
          {i === value ? 'bg-maree-secondary text-maree-accent' : 'bg-maree-accent text-maree-secondary'}
          {i === 0 ? 'rounded-tr-xl' : ''} 
          {i === items.length - 1 ? 'rounded-tl-xl' : ''} 
          cursor-pointer
        "
      >
        {item.name}
      </button>
    {/each}
  </div>
  <div
    class="
      p-10
    "
  >
    {#each items as item, i (i)}
      {#if i === value}
        <item.component {...item.props} />
      {/if}
    {/each}
  </div>
</div>