<script>
	import ContentPage from "$lib/components/pages/ContentPage.svelte";
	import MediaPage from "$lib/components/pages/MediaPage.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import TypePage from "$lib/components/pages/TypePage.svelte";
	import FilePage from "$lib/components/pages/FilePage.svelte";
	import { goto } from "$app/navigation";

  let { data } = $props();

  let audios = $state([]);
  let medias = $state([]);
  let types = $state([]);
  let contents = $state([]);
  let currentTab = $state(0);

  let items = $derived.by(() => [
    {
      name: 'الملف',
      props: {
        audios,
        options: {
          medias: medias.map(e => ({ name: e.name, value: e.id })),
          types: types.map(e => ({ name: e.name, value: e.id })),
          contents: contents.map(e => ({ name: e.name, value: e.id, isLecture: e.isLecture })),
        }
      },
      component: FilePage,
      formAction: '?/loadFile',
    },
    {
      name: 'الوسيطة',
      props: { 
        medias,
      },
      component: MediaPage,
      formAction: '?/loadMedia',
    },
    {
      name: 'النوع',
      props: {
        types,
      },
      component: TypePage,
      formAction: '?/loadType',
    },
    {
      name: 'الموضوع',
      props: {
        contents,
      },
      component: ContentPage,
      formAction: '?/loadContent',
    }
  ]);


  function onChangeTab(i) {
    if (i === 0) {
      goto(`/admin/manage?${new URLSearchParams({ tab: 'file' })}`)
    } else if (i === 1) {
      goto(`/admin/manage?${new URLSearchParams({ tab: 'media' })}`)
    } else if (i === 2) {
      goto(`/admin/manage?${new URLSearchParams({ tab: 'type' })}`)
    } else if (i === 3) {
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