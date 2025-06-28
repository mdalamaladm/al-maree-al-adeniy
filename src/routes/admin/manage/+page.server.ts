export async function load ({ fetch }) {
  const resAudios = await fetch('/api/file');
  const audios = await resAudios.json();

  const resMedias = await fetch('/api/media');
  const medias = await resMedias.json();

  const resTypes = await fetch('/api/type');
  const types = await resTypes.json();

  const resContents = await fetch('/api/content');
  const contents = await resContents.json();

  return {
    audios,
    medias,
    types,
    contents,
  }
}