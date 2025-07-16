<script>
	import ContentPage from "$lib/components/pages/ContentPage.svelte";
	import MediaPage from "$lib/components/pages/MediaPage.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import TypePage from "$lib/components/pages/TypePage.svelte";
	import FilePage from "$lib/components/pages/FilePage.svelte";
	import { goto } from "$app/navigation";
	import Button from "$lib/components/Button.svelte";
	import { manage } from "./manage.svelte.js";

  let { data } = $props();

  let files = $state([]);
  let medias = $state([]);
  let types = $state([]);
  let contents = $state([]);
  let currentTab = $state(0);
  let isAddFilePage = $state(false);

  let items = $derived.by(() => [
    {
      name: 'الملف',
      props: {
        auth: data.auth,
        files,
        isAddFilePage,
        options: {
          medias: medias.map(e => ({ name: e.name, value: e.alias })),
          types: types.map(e => ({ name: e.name, value: e.alias })),
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
    let confirm = true;

    if (manage.isUploading) {
      confirm = window.confirm('Are you sure you want to leave? Your changes may not be saved.');
    }

    if (confirm) {
      manage.isUploading = false;

      manage.filesUpload.forEach(f => {
        f.meta.abort();
      });

      manage.filesUpload = [];

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
  }

  $effect.pre(() => {
    files = data.files;
    medias = data.medias;
    types = data.types;
    contents = data.contents;

    const urlParams = new URLSearchParams(window.location.search);
    const tabQuery = urlParams.get('tab');

    if (tabQuery === 'file') {
      isAddFilePage = false;
      currentTab = 0;
    } else if (tabQuery === 'add-file') {
      isAddFilePage = true;
      currentTab = 0;
    } else if (tabQuery === 'media') {
      isAddFilePage = false;
      currentTab = 1;
    } else if (tabQuery === 'type') {
      isAddFilePage = false;
      currentTab = 2;
    } else if (tabQuery === 'content') {
      isAddFilePage = false;
      currentTab = 3;
    }
  });
</script>

<section
  class="
    min-h-screen
    p-10
    bg-maree-main
  "
>
  <form
    method="POST"
    action="?/logout"
    class="mb-10"
  >
    <Button
      type="solid"
      color="secondary"
      class="bg-red-600"
      label="تسجيل الخروج"
      submit
    />
  </form>
  <Tab
    onchange={onChangeTab}
    {items}
    bind:value={currentTab}
  />
</section>