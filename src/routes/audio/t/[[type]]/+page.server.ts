export async function load ({ params, fetch, url }) {
  async function loadContents () {
    const res = await fetch(`/api/content?${new URLSearchParams({ typeId: params.type })}`);

    return await res.json();
  }

  async function loadType () {
    const res = await fetch(`/api/type/${params.type}`);

    return await res.json();
  }

  async function loadFiles () {
    const id = params.type;
    const searchParams = new URLSearchParams({
      mediaId: 'audio',
      typeId: id,
    });

    const res = await fetch(`/api/file?${searchParams}`);

    return await res.json();
  }

  let playlist = await loadFiles();
  playlist = playlist
    .map(f => ({
      ...f,
      content: f.content.id,
      amplitudes: JSON.parse(f.amplitudes),
    }));
    
  const type = await loadType();
  let contents = await loadContents();
  contents = [
    { name: 'كل موضوع', id: null },
    ...contents
  ];
  contents = contents
    .filter(c => c.id !== 1)
    .map(c => ({
      name: c.name,
      value: c.id
    }));

  return {
    typeName: type.name,
    contents,
    playlist,
  }
}