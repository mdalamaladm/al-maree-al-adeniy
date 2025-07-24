import { json } from '@sveltejs/kit';

export async function POST ({ request, fetch }) {
  const { id } = await request.json();

  const headRes = await fetch(`/api/file/meta/${id}?${new URLSearchParams({ ContentLength: 'true' })}`);
  const { ContentLength: length } = await headRes.json();

  const res = await fetch(`/api/file/${id}`);
  const { src, duration } = await res.json();

  return json({ src, duration, length }, { status: 201 });
}