import { PUBLIC_BASE_URL } from '$env/static/public'

async function customFetch(path, options, { cookies, redirect }) {
  let res = await fetch(`${PUBLIC_BASE_URL}${path}`, options);

  if (path !== '/admin/auth' && (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE')) {
    res = await res.json();

    if (res.statusCode === 401 && cookies && redirect) {
      cookies.delete('auth', { path: '/admin' });

      redirect(303, '/admin/login')
    }
  }

  return res;
}

export function createCustomFetch (params = {}) {
  return (path, options = {}) => customFetch(path, options, params);
} 