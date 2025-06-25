export async function load ({ fetch }) {
  const res = await fetch('/api/file');
  const audios = await res.json();

  return {
    audios,
  }
}