import type { LayoutLoad } from './$types';
const intialUserData = {
	playerName: 'Stranger',
	firstTimePlaying: true,
	landingPageComplete: false,
	storyComplete: false,
	hangmanClueObtained: false,
	memoryClueObtained: false,
	quizClueObtained: false,
	backDoorOpened: false,
	playerAllowsMusic: false,
	playerAllowsSound: false
};
export const load = (async () => {
	return {
		intialUserData
	};
}) satisfies LayoutLoad;
