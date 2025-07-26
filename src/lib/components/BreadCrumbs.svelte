<script>
	import HomeIcon from "$lib/icons/HomeIcon.svelte";

  let { items, class: className = '' } = $props();
</script>

<div
  class="
    flex
    flex-wrap
    items-center
    {className}
  "
>
  {#each items as item, i (i)}
    {#if i !== 0}
      <p
        class="
          text-2xl
          text-maree-dark-accent
          select-none
        "
      >
        /
      </p>
    {/if}

    {#if !item.href}
      <p
        class="
          my-2
          mx-2
          md:mx-5
          text-2xl
          text-maree-dark-accent
          select-none
        "
      >
        {item.name}
      </p>
    {:else if item.href === '/'}
      <a
        href="/"
        class="
          my-2
          mx-2
          md:mx-5
          text-maree-dark-accent
        "
      >
        <HomeIcon
          class="
            size-8
          "
        />
      </a>
    {:else}
      <a
        href={item.href}
        class="
          my-2
          mx-2
          md:mx-5
          text-2xl
          text-maree-dark-accent
        "
      >
        {item.name}
      </a>
    {/if}
  {/each}
</div>