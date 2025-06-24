export async function load ({ fetch }) {
  const resFiles = await fetch('/api/admin/file');
  const files = await resFiles.json();

  const resTypes = await fetch('/api/admin/type');
  const types = await resTypes.json();

  const resContents = await fetch('/api/admin/content');
  const contents = await resContents.json();

  return {
    files,
    types,
    contents,
  }
}