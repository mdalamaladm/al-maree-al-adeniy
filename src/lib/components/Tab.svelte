<script>
  let { items = [] } = $props();

  let currentTab = $state(0);
</script>

<div>
  <div>
    {#each items as item, i (i)}
      <button
        onclick={() => currentTab = i}
        class="
          px-5
          py-3
          text-xl
          {i === currentTab ? 'bg-maree-secondary text-maree-accent' : 'bg-maree-accent text-maree-secondary'}
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
      {#if i === currentTab}
        <item.component {...item.props} />
      {/if}
    {/each}
  </div>
</div>