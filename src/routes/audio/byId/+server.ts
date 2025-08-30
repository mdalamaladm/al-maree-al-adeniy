import { createCustomFetch } from '$lib/fetch.js';
import { redirect } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function POST (params) {
  const { request } = params;

  const { id } = await request.json();

  const customFetch = createCustomFetch({ ...params, redirect });

  const res = await customFetch(`/file/${id}`);
  const { src } = await res.json();

  return json({ src }, { status: 201 });
}