import { redirect } from '@sveltejs/kit';

export const actions = {
  createMedia: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const name = formData.get('name');

    const payload = { name };

    await fetch('/api/admin/media', {
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

    await fetch(`/api/admin/media/${url.searchParams.get('id')}`, {
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
    await fetch(`/api/admin/media/${url.searchParams.get('id')}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
    });

    return {
      success: true
    }
  },
  createType: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const name = formData.get('name');

    const payload = { name };

    await fetch('/api/admin/type', {
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
  editType: async ({ url, request, fetch, cookies }) => {
    const formData = await request.formData();
    const name = formData.get('name');

    const payload = { name };

    await fetch(`/api/admin/type/${url.searchParams.get('id')}`, {
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
  deleteType: async ({ url, fetch, cookies }) => {
    await fetch(`/api/admin/type/${url.searchParams.get('id')}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
    });

    return {
      success: true
    }
  },
  createContent: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const isLecture = formData.has('isLecture');

    const payload = { name, isLecture };

    await fetch('/api/admin/content', {
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
  editContent: async ({ url, request, fetch, cookies }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const isLecture = formData.has('isLecture');

    const payload = { name, isLecture };

    await fetch(`/api/admin/content/${url.searchParams.get('id')}`, {
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
  deleteContent: async ({ url, fetch, cookies }) => {
    await fetch(`/api/admin/content/${url.searchParams.get('id')}`, {
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

export async function load ({ fetch, cookies }) {
  const resAudios = await fetch('/api/admin/file', {
    headers: {
      "Authorization": `Bearer ${cookies.get('auth')}`
    },
  });
  const audios = await resAudios.json();

  const resMedias = await fetch('/api/admin/media', {
    headers: {
      "Authorization": `Bearer ${cookies.get('auth')}`
    },
  });
  const medias = await resMedias.json();

  const resTypes = await fetch('/api/admin/type', {
    headers: {
      "Authorization": `Bearer ${cookies.get('auth')}`
    },
  });
  const types = await resTypes.json();

  const resContents = await fetch('/api/admin/content', {
    headers: {
      "Authorization": `Bearer ${cookies.get('auth')}`
    },
  });
  const contents = await resContents.json();

  if (
    audios.statusCode === 401 ||
    medias.statusCode === 401 ||
    types.statusCode === 401 ||
    contents.statusCode === 401
  ) {
    cookies.delete('auth', { path: '/admin' });
    redirect(303, '/admin/login')
  }

  console.log(audios.length);
  console.log(medias.length);
  console.log(types.length);
  console.log(contents.length);

  return {
    audios,
    medias,
    types,
    contents,
  }
}