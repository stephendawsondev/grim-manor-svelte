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
