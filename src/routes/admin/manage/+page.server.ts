import { redirect } from '@sveltejs/kit';

export const actions = {
  createMedia: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const name = formData.get('name');

    const payload = { name };

    await fetch('/api/media', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
    }
  },
  editMedia: async ({ url, request, fetch, cookies }) => {
    const formData = await request.formData();
    const name = formData.get('name');

    const payload = { name };

    await fetch(`/api/media/${url.searchParams.get('id')}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
    }
  },
  deleteMedia: async ({ url, fetch, cookies }) => {
    await fetch(`/api/media/${url.searchParams.get('id')}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
    });

    return {
      success: true
    }
  }
}

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