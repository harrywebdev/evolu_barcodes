import { VERCEL_GIT_COMMIT_SHA } from '$env/static/private';
import { version } from '../../package.json';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	return {
		VERCEL_GIT_COMMIT_SHA: VERCEL_GIT_COMMIT_SHA || 'unknown',
		version
	};
};
