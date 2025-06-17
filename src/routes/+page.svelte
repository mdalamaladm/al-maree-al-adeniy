<script>
  let navigations = [
    {
      name: 'المحاضرات',
      href: '/audio/muhadharat',
    },
    {
      name: 'الخطب',
      href: '/audio/khuthab',
    },
    {
      name: 'الدروس',
      href: '/audio/durus',
    },
    {
      name: 'الفتاوى',
      href: '/audio/fatwa',
    },
  ]
</script>

<section
  class="
    grid
    grid-cols-2
    grid-rows-[auto_repeat(4, minmax(0, 1fr))]
    md:grid-rows-3
    gap-5
    min-h-screen
    py-15
    md:py-30
    px-20
    lg:px-40
    h-full
    bg-maree-main
  "
>
  <h1
    class="
      col-span-2
      mb-10
      text-center
      text-5xl
      md:text-6xl
      text-maree-secondary
      font-medium
    "
  >
    الشيخ عبد الرحمن بن مرعي العدني
  </h1>
  {#each navigations as nav}
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
