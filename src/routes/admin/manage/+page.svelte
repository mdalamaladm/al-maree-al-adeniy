<script>
	import ContentPage from "$lib/components/pages/ContentPage.svelte";
	import MediaPage from "$lib/components/pages/MediaPage.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import TypePage from "$lib/components/pages/TypePage.svelte";
	import AudioPage from "$lib/components/pages/AudioPage.svelte";
	import { goto } from "$app/navigation";

  let { data } = $props();

  let audios = $state([]);
  let medias = $state([]);
  let types = $state([]);
  let contents = $state([]);
  let currentTab = $state(0);
  
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
        loadAudios,
        options: {
          medias: medias.map(e => ({ name: e.name, value: e.id })),
          types: types.map(e => ({ name: e.name, value: e.id })),
          others: others.map(e => ({ name: e.name, value: e.id })),
          lectures: lectures.map(e => ({ name: e.name, value: e.id })),
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
    if (i === 0) {
      loadAudios();
      goto(`/admin/manage?${new URLSearchParams({ tab: 'file' })}`)
    } else if (i === 1) {
      loadMedias();
      goto(`/admin/manage?${new URLSearchParams({ tab: 'media' })}`)
    } else if (i === 2) {
      loadTypes();
      goto(`/admin/manage?${new URLSearchParams({ tab: 'type' })}`)
    } else if (i === 3) {
      loadContents();
      goto(`/admin/manage?${new URLSearchParams({ tab: 'content' })}`)
    }
  }

  $effect.pre(() => {
    audios = data.audios;
    medias = data.medias;
    types = data.types;
    contents = data.contents;

    const urlParams = new URLSearchParams(window.location.search);
    const tabQuery = urlParams.get('tab');

    if (tabQuery === 'file') currentTab = 0;
    else if (tabQuery === 'media') currentTab = 1;
    else if (tabQuery === 'type') currentTab = 2;
    else if (tabQuery === 'content') currentTab = 3;
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
    bind:value={currentTab}
  />
</section>