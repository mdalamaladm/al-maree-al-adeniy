import { createCustomFetch } from '$lib/fetch.js';
import { redirect } from '@sveltejs/kit';

export async function load (loadParams) {
  const { params } = loadParams

  const customFetch = createCustomFetch({ ...loadParams, redirect });
  
  
  async function loadContents () {
    const res = await customFetch(`/content?${new URLSearchParams({ typeId: params.type })}`);

    return await res.json();
  }

  async function loadType () {
    const res = await customFetch(`/type/${params.type}`);

    return await res.json();
  }

  async function loadFiles (contents) {
    const id = params.type;
    let searchParams = {
      mediaId: 'audio',
      typeId: id,
    };

    if (id === 'durus') {
      searchParams.contentId = contents[0].id;
    }

    searchParams = new URLSearchParams(searchParams);

    const res = await customFetch(`/file?${searchParams}`);

    return await res.json();
  }

  let contents = await loadContents();
  const type = await loadType();
  let playlist = await loadFiles(contents);

  playlist = playlist
    .map(f => ({
      ...f,
      content: f.content.id,
      amplitudes: JSON.parse(f.amplitudes),
    }));
    
  if (params.type !== 'durus') {
    contents = [
      { name: 'كل موضوع', id: null },
      ...contents
    ];
  }

  contents = contents
    .filter(c => c.id !== 1)
    .map(c => ({
      name: c.name,
      value: c.id,
    }));

  return {
    typeAlias: type.alias,
    typeName: type.name,
    contents,
    playlist,
  }
}