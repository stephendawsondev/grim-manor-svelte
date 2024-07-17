export interface Question {
	question: string;
	answers: string[];
	correctAnswerIndex: number;
}

export interface DialogueItem {
	text: string;
	choices?: {
		text: string;
		link?: string;
		action?: () => void;
	}[];
}

export interface UserData {
	playerName: string;
	firstTimePlaying: boolean;
	landingPageComplete: boolean;
	storyComplete: boolean;
	hangmanClueObtained: boolean;
	memoryClueObtained: boolean;
	quizClueObtained: boolean;
	backDoorOpened: boolean;
	playerAllowsMusic: boolean;
	playerAllowsSound: boolean;
	currentlyPlaying: string;
}
