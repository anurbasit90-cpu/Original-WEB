// Allow overriding the API base via environment variable for staging/production
export const WP_API_BASE =
	(import.meta?.env && import.meta.env.VITE_WP_API_BASE) ||
	'https://admin.aryatek.co.id/wp-json/wp/v2';
