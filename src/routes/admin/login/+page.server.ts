import { env } from '$env/dynamic/private';
import { createCustomFetch } from '$lib/fetch.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async (params) => {
    const { cookies, request } = params;

    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    const payload = { username, password };

    const customFetch = createCustomFetch({ ...params, redirect })

    const res = await customFetch('/admin/auth', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.statusCode === 401) {
      return;
    }

    cookies.set('auth', data.access_token, { path: '/admin', maxAge: 60 * 60, secure: env.IS_HTTPS === '1' });

    redirect(303, '/admin/manage');
  }
}