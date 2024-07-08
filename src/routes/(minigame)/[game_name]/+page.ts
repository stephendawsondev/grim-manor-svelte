import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		gameName: params.game_name
	};
}) satisfies PageLoad;
