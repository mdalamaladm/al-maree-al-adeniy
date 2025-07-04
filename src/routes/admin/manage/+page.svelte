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
  
  let others = $derived.by(() => {
    return contents.filter(c => !c.isLecture);
  });
  let lectures = $derived.by(() => {
    return contents.filter(c => c.isLecture);
  });

  let items = $derived([
    {
      name: 'الصوتية',
      props: {
        audios,
        options: {
          medias: medias.map(m => ({ name: m.name, value: m.id, alias: m.alias })),
          types: types.map(t => ({ name: t.name, value: t.id, alias: t.alias })),
          others: others.map(o => ({ name: o.name, value: o.id })),
          lectures: lectures.map(l => ({ name: l.name, value: l.id })),
        }
      },
      component: AudioPage
    },
    {
      name: 'الوسيطة',
      props: { 
        medias,
        loadMedias,
      },
      component: MediaPage
    },
    {
      name: 'النوع',
      props: {
        types,
        loadTypes,
      },
      component: TypePage
    },
    {
      name: 'الموضوع',
      props: {
        contents,
        loadContents
      },
      component: ContentPage
    }
  ]);

  async function loadAudios () {
    const res = await fetch('/api/file');

    audios = await res.json();
  }

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
    if (i === 0) loadAudios();
    if (i === 1) loadMedias();
    else if (i === 2) loadTypes();
    else if (i === 3) loadContents();
  }

  $effect(() => {
    audios = data.audios;
    medias = data.medias;
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
  <Tab
    onchange={onChangeTab}
    {items}
  />
</section>