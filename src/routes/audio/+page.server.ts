import { createCustomFetch } from '$lib/fetch.js';
import { redirect } from '@sveltejs/kit';

export async function load (params) {
  const { url } = params

  const customFetch = createCustomFetch({ ...params, redirect });

  async function loadMedia () {
    const id = url.pathname.slice(1);


    const res = await customFetch(`/media/${id}`);

    return await res.json();
  }

  let media = await loadMedia();

  return {
    types: media.types.map(t => ({ name: t.name, href: `/audio/t/${t.alias}` }))
  }
}