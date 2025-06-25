<script>
	import ContentPage from "$lib/components/pages/ContentPage.svelte";
	import MediaPage from "$lib/components/pages/MediaPage.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import TypePage from "$lib/components/pages/TypePage.svelte";
	import AudioPage from "$lib/components/pages/AudioPage.svelte";

  let { data } = $props();

  let audios = $state([]);
  let medias = $state([]);
  let types = $state([]);
  let contents = $state([]);

  let items = $derived([
    {
      name: 'الصوتية',
      props: { audios },
      component: AudioPage
    },
    {
      name: 'الوسيطة',
      props: { medias },
      component: MediaPage
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

  async function loadMedias () {
    const res = await fetch('/api/media');

    medias = await res.json();
  }

  async function loadTypes () {
    const res = await fetch('/api/type');

    types = await res.json();
  }

  async function loadContents () {
    const res = await fetch('/api/content');

    contents = await res.json();
  }

  function onChangeTab(i) {
    if (i === 1) loadMedias();
    else if (i === 2) loadTypes();
    else if (i === 3) loadContents();
  }

  $effect(() => {
    audios = data.audios;
  });
</script>

<section
  class="
    min-h-screen
    p-10
    bg-maree-main
  "
>
  <Tab
    onchange={onChangeTab}
    {items}
  />
</section>