import { redirect } from '@sveltejs/kit';

export const actions = {
  editFile: async ({ url, request, fetch, cookies }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const mediaId = formData.get('mediaId');
    const typeId = formData.get('typeId');
    const contentId = formData.get('contentId');

    const payload = {
      name,
      mediaId: +mediaId,
      typeId: +typeId,
      contentId: +contentId,
    };

    await fetch(`/api/admin/file/${url.searchParams.get('id')}`, {
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
  deleteFile: async ({ url, fetch, cookies }) => {
    await fetch(`/api/admin/file/${url.searchParams.get('id')}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
    });

    return {
      success: true
    }
  },
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

export async function load ({ fetch, cookies, url }) {
  async function loadFiles () {
    const res = await fetch('/api/admin/file', {
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      }
    });

    return await res.json();
  }

  async function loadMedias () {
    const res = await fetch('/api/admin/media', {
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      }
    });

    return await res.json();
  }

  async function loadTypes () {
    const res = await fetch('/api/admin/type', {
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      }
    });

    return await res.json();
  }

  async function loadContents () {
    const res = await fetch('/api/admin/content', {
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      }
    });

    return await res.json();
  }

  let files = [];
  let medias = [];
  let types = [];
  let contents = [];

  const tab = url.searchParams.get('tab');

  if (tab === null || tab === 'file' || tab === 'add-file') {
    files = await loadFiles();
    medias = await loadMedias();
    types = await loadTypes();
    contents = await loadContents();
  }
  else if (tab === 'media') medias = await loadMedias();
  else if (tab === 'type') types = await loadTypes();
  else if (tab === 'content') contents = await loadContents();

  if (
    files.statusCode === 401 ||
    medias.statusCode === 401 ||
    types.statusCode === 401 ||
    contents.statusCode === 401
  ) {
    cookies.delete('auth', { path: '/admin' });
    redirect(303, '/admin/login')
  }

  return {
    files,
    medias,
    types,
    contents,
  }
}