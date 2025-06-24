import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.cookies.get('auth');

	if (event.url.pathname.startsWith('/admin/manage')) {
		if (!cookies) {
			redirect(303, '/admin/login');
		}
	} else if (event.url.pathname.startsWith('/admin/login')) {
		if (cookies) {
			redirect(303, '/admin/manage');
		}
	}

	const response = await resolve(event);
	return response;
};
