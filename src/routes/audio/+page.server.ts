export async function load ({ fetch, url }) {
  async function loadMedia () {
    const id = url.pathname.slice(1);

    const res = await fetch(`/api/media/${id}`);

    return await res.json();
  }

  let media = await loadMedia();

  return {
    types: media.types.map(t => ({ name: t.name, href: `/audio/t/${t.alias}` }))
  }
}