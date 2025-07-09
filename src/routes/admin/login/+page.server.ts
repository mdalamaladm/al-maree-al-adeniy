import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ cookies, request, fetch }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    const payload = { username, password };

    const res = await fetch('/api/admin/auth', {
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

    cookies.set('auth', data.access_token, { path: '/admin', maxAge: 60 });

    redirect(303, '/admin/manage');
  }
}