<script>
  let navigations = [
    {
      name: 'الصوتية',
      href: '/audio',
    },
    {
      name: 'الفيديو',
      href: '/video',
    },
  ]
</script>

<section
  class="
    grid
    grid-cols-2
    grid-rows-[auto_repeat(4, minmax(0, 1fr))]
    md:grid-rows-[auto_repeat(, minmax(0, 1fr))]
    gap-5
    min-h-screen
    py-15
    pt-5
    md:py-30
    px-20
    lg:px-30
    h-full
    bg-maree-main
  "
>
  <h1
    class="
      hidden
      md:block
      col-span-1
      text-center
      text-3xl
      md:text-5xl
      lg:text-6xl
      text-maree-secondary
      font-medium
      self-center
      text-nowrap
      l
    "
  >
    <span>
      الشيخ عبد الرحمن
    </span>
    <br>
    <span>
      بن مرعي العدني
    </span>
    <br>
    <span
      class="
        text-3xl
      "
    >
      رحمه الله تعالى
    </span>
  </h1>
  
  <img
    src="/logo.svg"
    alt="الشيخ عبد الرحمن بن مرعي العدني"
    class="
      col-span-2
      md:col-span-1
      size-64
      lg:size-80
      justify-self-center
      self-center
    "
  >
  {#each navigations as nav, i (i)}
    <a
      href={nav.href}
      class="
        col-span-2
        md:col-span-1
        flex
        items-center
        justify-center
        px-10
        py-5
        bg-maree-dark-accent
        text-2xl
        md:text-4xl
        text-maree-accent
        font-medium
        rounded-xl
        hover:bg-maree-darker-accent
        cursor-pointer
      "
    >
      {nav.name}
    </a>
  {/each}
</section>
