<script>
	import ChevronDownIcon from "$lib/icons/ChevronDownIcon.svelte";

  let {
    value = $bindable(null),
    label = '',
    name = 'select',
    options = [],
    getter = () => value,
    setter = (v) => value = v,
    class: className = '',
    ...props
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
  <div
    class="
      relative
    "
  >
    <select
      bind:value={
        () => getter(),
        (v) => setter(v, value)
      }
      {name}
      class="
        w-full
        p-3
        bg-maree-accent
        text-xl
        text-maree-darker-accent
        rounded-xl
        appearance-none
      "
      {...props}
    >
      {#each options as opt (opt.value)}
        <option value={opt.value}>{opt.name}</option>
      {/each}
    </select>
    <div
      class="
        grid
        place-content-center
        absolute
        top-0
        left-0
        h-full
        w-12
      "
    >
      <ChevronDownIcon
        class="
          size-6
          text-maree-darker-accent
        "
      />
    </div>
  </div>
</label>