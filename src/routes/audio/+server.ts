import { createCustomFetch } from '$lib/fetch.js';
import { redirect } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function POST (params) {
  const { request } = params;

  const { content, type } = await request.json();

  const searchParams = new URLSearchParams({
    mediaId: 'audio',
    typeId: type,
    contentId: content,
  })

  const customFetch = createCustomFetch({ ...params, redirect });

  const res = await customFetch(`/file?${searchParams}`);
  const playlist = await res.json();

  return json({ playlist }, { status: 201 });
}