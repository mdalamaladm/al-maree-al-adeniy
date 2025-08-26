import { createCustomFetch } from '$lib/fetch.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
  editFile: async (params) => {
    const { url, request, cookies } = params;

    const formData = await request.formData();
    const name = formData.get('name');
    const extension = formData.get('extension');
    const mediaId = formData.get('mediaId');
    const typeId = formData.get('typeId');
    const contentId = formData.get('contentId');

    const payload = {
      name,
      extension,
      mediaId,
      typeId,
      contentId: +contentId,
    };

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch(`/admin/file/${url.searchParams.get('id')}`, {
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
  deleteFile: async (params) => {
    const { url, cookies } = params;

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch(`/admin/file/${url.searchParams.get('id')}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
    });

    return {
      success: true
    }
  },
  createMedia: async (params) => {
    const { request, cookies } = params;

    const formData = await request.formData();
    const name = formData.get('name');
    const alias = formData.get('alias');

    const payload = {
      name,
      alias,
    };

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch('/admin/media', {
      method: 'POST',
      // headers: {
      //   "Content-Type": "application/json",
      //   "Authorization": `Bearer ${cookies.get('auth')}`
      // },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
    }
  },
  editMedia: async (params) => {
    const { url, request, cookies } = params;

    const formData = await request.formData();
    const name = formData.get('name');
    const alias = formData.get('alias');

    const payload = {
      name,
      alias,
    };

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch(`/admin/media/${url.searchParams.get('id')}`, {
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
  deleteMedia: async (params) => {
    const { url, cookies } = params;

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch(`/admin/media/${url.searchParams.get('id')}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
    });

    return {
      success: true
    }
  },
  createType: async (params) => {
    const { request, cookies } = params;

    const formData = await request.formData();
    const name = formData.get('name');
    const alias = formData.get('alias');

    const payload = {
      name,
      alias,
    };

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch('/admin/type', {
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
  editType: async (params) => {
    const { url, request, cookies } = params;

    const formData = await request.formData();
    const name = formData.get('name');
    const alias = formData.get('alias');

    const payload = {
      name,
      alias,
    };

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch(`/admin/type/${url.searchParams.get('id')}`, {
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
  deleteType: async (params) => {
    const { url, fetch, cookies } = params;

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch(`/admin/type/${url.searchParams.get('id')}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
    });

    return {
      success: true
    }
  },
  createContent: async (params) => {
    const { request, cookies } = params;

    const formData = await request.formData();
    const name = formData.get('name');
    const isLecture = formData.has('isLecture');

    const payload = { name, isLecture };

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch('/admin/content', {
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
  editContent: async (params) => {
    const { url, request, cookies } = params;

    const formData = await request.formData();
    const name = formData.get('name');
    const isLecture = formData.has('isLecture');

    const payload = { name, isLecture };

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch(`/admin/content/${url.searchParams.get('id')}`, {
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
  deleteContent: async (params) => {
    const { url, cookies } = params;

    const customFetch = createCustomFetch({ ...params, redirect })

    await customFetch(`/admin/content/${url.searchParams.get('id')}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${cookies.get('auth')}`
      },
    });

    return {
      success: true
    }
  },
  logout: async ({ cookies }) => {
    cookies.delete('auth', { path: '/admin' });

    redirect(303, '/admin/login');
  }
}

export async function load (params) {
  const { cookies, url } = params;

  const auth = cookies.get('auth');

  const customFetch = createCustomFetch({ ...params, redirect })

  async function loadFiles () {
    const res = await customFetch('/admin/file', {
      headers: {
        "Authorization": `Bearer ${auth}`
      }
    });

    return await res.json();
  }

  async function loadMedias () {
    const res = await customFetch('/admin/media', {
      headers: {
        "Authorization": `Bearer ${auth}`
      }
    });

    return await res.json();
  }

  async function loadTypes () {
    const res = await customFetch('/admin/type', {
      headers: {
        "Authorization": `Bearer ${auth}`
      }
    });

    return await res.json();
  }

  async function loadContents () {
    const res = await customFetch('/admin/content', {
      headers: {
        "Authorization": `Bearer ${auth}`
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

  if (
    files.statusCode === 404 ||
    medias.statusCode === 404 ||
    types.statusCode === 404 ||
    contents.statusCode === 404
  ) {
    files = [];
    medias = [];
    types = [];
    contents = [];
  }

  return {
    files,
    medias,
    types,
    contents,
    auth,
  }
}