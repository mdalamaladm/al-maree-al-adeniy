<script>
  let { submit = false, type, color, size = 'medium', block = false, label = '', class: className = '', ...props } = $props();

  let buttonStyle = $derived.by(() => {
    if (type === 'solid') {
      if (color === 'main') return 'bg-maree-main text-maree-darker-accent';
      else if (color === 'secondary') return 'bg-maree-secondary text-maree-accent';
    } else if (type === 'outlined') {
      if (color === 'main') return 'text-maree-main border-2 border-maree-main';
      else if (color === 'secondary') return 'text-maree-secondary border-2 border-maree-secondary';
    }
  });

  let buttonSize = $derived.by(() => {
    if (size === 'small') return '';
    else if (size === 'medium') return 'px-5 py-3 text-xl';
    else if (size === 'large') return '';
  })
</script>

<button
  class="
    grid
    place-content-center
    {block ? 'w-full' : ''}
    {buttonSize}
    {buttonStyle}
    rounded-lg
    cursor-pointer
    {className}
  "
  {...props}
  type={submit ? 'submit' : 'button'}
>
  {label}
</button>