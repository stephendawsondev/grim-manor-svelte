import { savePlayerData, loadPlayerData } from '$lib/utils/gamedataLocalstore.js';
import { showDialogueAsync } from '$lib/utils/dialogueGeneration.js';
const gameContainer = document.getElementById('game-container');
const lastquizContainer = document.getElementById('game-lastquiz');

const lastquiz = {
	form1: {
		question: 'How did I die?',
		answers: {
			a: 'You were poisoned by your fiancée',
			b: 'You hung yourself',
			c: "You were stabbed by your fiancée's lover"
		},
		correctAnswer: 'b'
	},
	form2: {
		question: 'Why?',
		answers: {
			a: 'My fiancée loved someone else',
			b: 'It was an accident',
			c: "I had kissed another man's wife"
		},
		correctAnswer: 'a'
	},
	form3: {
		question: 'Where is my body now?',
		answers: {
			a: 'It was put in the lake',
			b: 'It was hidden in the attic',
			c: 'It was buried under the trees next to the house'
		},
		correctAnswer: 'c'
	}
};

const quizButtons = document?.querySelectorAll('.button-lastquiz');
const questionElement = document?.getElementById('question');
const evaluationElement = document?.getElementById('evaluation');

let number_test = 0;
let score = 0;

function nextQuestion() {
	number_test++;
	// console.log("nextQuestion", number_test);
	if (number_test === 4) {
		gameLastQuiz_over();
		// return;
	} else {
		// evaluationElement.textContent = ``;
		let temp = 0;
		quizButtons.forEach((button) => {
			button.removeEventListener('click', () => {});
		});
		for (const [key, value] of Object.entries(lastquiz)) {
			let button;
			temp++;
			if (temp !== number_test) continue;
			// console.log(`${key}: ${value}`);
			if (questionElement) {
				questionElement.textContent = value.question;
			}

			for (const [key2, value2] of Object.entries(value.answers)) {
				// console.log(`${value.correctAnswer} - ${key2}: ${value2}`);
				button = document?.getElementById(`${key2}`);
				if (button) {
					button.textContent = value2;
					button.removeEventListener('click', () => {});

					if (key2 === value.correctAnswer) {
						button.classList.add('selected');
					} else {
						button.classList.remove('selected');
					}
				}
			}
		}
	}
}

quizButtons.forEach((button) => {
	button.addEventListener('click', () => {
		if (button.classList.contains('selected')) {
			score++;
			evaluationElement.textContent = `Correct`;
			// alert("Correct");
		} else {
			evaluationElement.textContent = `False`;
		}
		setTimeout(() => {
			evaluationElement.textContent = ``;
		}, 1000);
		nextQuestion();
	});
});

async function gameLastQuiz_over() {
	quizButtons.forEach((button) => {
		button.removeEventListener('click', () => {});
	});
	document.getElementById('game-lastquiz').classList.remove('active');
	console.log('gameLastQuiz_over', score);

	if (score === 3) {
		const dialogue = [
			{
				text: 'That’s right I remember now… She said she loved me… But she did not.'
			},
			{
				text: 'I have wandered these halls for centuries filled with pain and anger without knowing why, but my memories left me long ago.'
			},
			{
				text: 'Thank you for your assistance, I feel that I can move on now. I am forever in your debt!'
			}
		];

		let loadedPlayerData = loadPlayerData();
		savePlayerData({ ...loadedPlayerData, backDoorOpened: true });
		gameContainer.classList.add('lastquiz-table');
		await showDialogueAsync(dialogue, true);

		// Next step in the game
	} else {
		const dialogue = [
			{
				text: 'Unfortunately you have missed some clues. Come back here and try again.'
			}
		];
		gameContainer.classList.add('lastquiz-table');
		await showDialogueAsync(dialogue, true);
	}

	const minigames = document.querySelectorAll('.minigame');
	for (const minigame of minigames) {
		minigame.classList.remove('active');
	}
	gameContainer.close();
}

async function initLastQuizGame() {
	// let loadedPlayerData = loadPlayerData();
	// alert("initLastQuizGame", DEBUG);
	// if (
	//   (!loadedPlayerData.hangmanClueObtained &&
	//     !loadedPlayerData.memoryClubObtained &&
	//     !loadedPlayerData.quizClueObtained) ||
	//   !DEBUG
	// ) {
	//   return;
	// } else {
	score = 0;
	number_test = 0;
	// const gameLastQuizElement = document.getElementById("game-lastquiz");
	// gameLastQuizElement.style.display = "block";
	const dialogue = [
		{
			text: 'Have you managed to discover what happened to me?'
		}
	];

	gameContainer.classList.add('lastquiz-table');
	await showDialogueAsync(dialogue, true);
	document.getElementById('game-lastquiz').classList.add('active');

	lastquizContainer.classList.add('active');
	nextQuestion();
	// }
}

//initLastQuizGame();

export { initLastQuizGame };
