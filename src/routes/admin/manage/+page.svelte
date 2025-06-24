<script>
	import AddAudio from "$lib/components/AddAudio.svelte";
	import ContentPage from "$lib/components/pages/ContentPage.svelte";
	import FilePage from "$lib/components/pages/FilePage.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import TypePage from "$lib/components/pages/TypePage.svelte";

  let { data } = $props();

  let files = $state([]);
  let types = $state([]);
  let contents = $state([]);

  let items = $derived([
    {
      name: 'الصوتية',
      component: AddAudio
    },
    {
      name: 'الملف',
      props: { files },
      component: FilePage
    },
    {
      name: 'النوع',
      props: { types },
      component: TypePage
    },
    {
      name: 'الموضوع',
      props: { contents },
      component: ContentPage
    }
  ]);

  $effect(() => {
    files = data.files;
    types = data.types;
    contents = data.contents;
  });
</script>

<section
  class="
    min-h-screen
    p-10
    bg-maree-main
  "
>
  <Tab {items} />
</section>