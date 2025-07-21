import { json } from '@sveltejs/kit';

export async function POST ({ request, fetch }) {
  console.log('POST');
  const { id } = await request.json();

  const headRes = await fetch(`/api/file/meta/${id}?${new URLSearchParams({ ContentLength: 'true' })}`);
  const { ContentLength: length } = await headRes.json();

  const res = await fetch(`/api/file/${id}`);
  const src = await res.text();

  return json({ src, length }, { status: 201 });
}