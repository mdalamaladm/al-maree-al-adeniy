<script>
	import EyeIcon from "$lib/icons/EyeIcon.svelte";
	import EyeSlashIcon from "$lib/icons/EyeSlashIcon.svelte";

  let { onInput = () => {}, value = $bindable(''), placeholder = null, label = null, class: className = '', name } = $props();

  let show = $state(false);
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
  <div
    class="
      relative
    "
  >
    <input
      type={show ? 'text' : 'password'}
      {name}
      {placeholder}
      oninput={(e) => onInput(e)}
      bind:value
      class="
        w-full
        p-2
        pl-13
        bg-maree-accent
        text-xl
        font-medium
        rounded-xl
      "
    >
    <div
      class="
        grid
        place-content-center
        absolute
        top-0
        left-3
        h-full
        text-maree-darker-accent
      "
    >
      {#if show}
      <EyeSlashIcon
          onclick={() => show = false}
          class="
            size-8
          "
          />
      {:else}
        <EyeIcon
          onclick={() => show = true}
          class="
            size-8
          "
          />
      {/if}
    </div>
  </div>
</label>