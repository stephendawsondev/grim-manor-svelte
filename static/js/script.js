// jshint esversion: 6

// Minigames code
import { startMemoryGame } from './minigames/memory-game.js';
import { handlePlay } from './minigames/quiz.js';
import { initLastQuizGame } from './minigames/lastquiz.js';
import { showDialogueAsync } from '$lib/utils/dialogueGeneration.js';
import { savePlayerData, updateLocalProperty } from '$lib/utils/gamedataLocalstore.js';
import {
	playerAllowsMusic,
	playerAllowsSound,
	loadAudio,
	addAudioIconEventListeners
} from '$lib/utils/audioSettings.js';
import {
	introDialogue,
	returnedButIncomplete,
	notEnoughCluesDialogue,
	memoryGameInitialDialgoue
} from '$lib/utils/dialogues.js';

const playMusicOnLoop = (audio) => {
	audio.loop = true;
	audio.play();
};

document.addEventListener('DOMContentLoaded', async () => {
	// Mansion interaction code
	const backgroundImage = document.getElementById('background-image'); // Select the background image
	const moveButtons = document.querySelectorAll('button'); // Select all buttons with the "move" class
	const mansionView = document.getElementById('mansion-container'); // Select the container with the mansion image
	const gameContainer = document.getElementById('game-container'); // Select the container for the minigames
	const interactiveButtons = document.querySelectorAll('.interactive'); // Select all buttons (doors) with the "interactive" class

	// let loadedPlayerData = loadPlayerData();
	// const audioObj = loadAudio(url_audios_deploy);
	// addAudioIconEventListeners(url_audios_deploy);

	const minigames = document.querySelectorAll('.minigame');
	for (const minigame of minigames) {
		minigame.classList.remove('active');
	}

	// if esc key is pressed, loop through
	// minigames and remove active class
	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			for (const minigame of minigames) {
				minigame.classList.remove('active');
			}
			gameContainer.className = '';
			gameContainer.close();
		}
		if (playerAllowsMusic) {
			audioObj.creepyWhistlyMusic.pause();
			playMusicOnLoop(audioObj.darkAmbientMusic);
		}
	});

	// loop through 'interactive' and disable
	for (const button of interactiveButtons) {
		button.disabled = true;
		button.classList.add('disabled');
		button.setAttribute('aria-disabled', 'true');
		// Add a click event to each button
		button.addEventListener('click', function () {
			displayMiniGames(this.id);
		});
	}
	// if (loadedPlayerData.firstTimePlaying) {
	// 	await showDialogueAsync(introDialogue);
	// 	updateLocalProperty('firstTimePlaying', false);
	// } else {
	await showDialogueAsync(returnedButIncomplete);
	// }

	// loop through 'interactive' and enable
	for (const button of interactiveButtons) {
		button.disabled = false;
		button.classList.remove('disabled');
		button.setAttribute('aria-disabled', 'false');
	}
	// ghost.classList.remove('active');

	// -------- Mini games functions ---------

	// (window.location.href = "game1.html");

	// This function displays the second mini game
	const miniGame3 = async () => {
		gameContainer.showModal();
		gameContainer.classList.add('boy-ghost');

		if (playerAllowsSound) {
			audioObj.stairs.play();
		}
		if (playerAllowsMusic) {
			playMusicOnLoop(audioObj.creepyWhistlyMusic);
		}
		await showDialogueAsync(memoryGameInitialDialgoue, true);
		startMemoryGame();
	};

	// This function displays the lastquiz mini game
	// const miniGame2 = async () => {
	// 	// loadedPlayerData = loadPlayerData();
	// 	if (
	// 		!loadedPlayerData.hangmanClueObtained ||
	// 		!loadedPlayerData.memoryClueObtained ||
	// 		!loadedPlayerData.quizClueObtained
	// 	) {
	// 		// alert("You need to complete the three games first!");
	// 		ghost.classList.add('active');
	// 		await showDialogueAsync(notEnoughCluesDialogue);
	// 		ghost.classList.remove('active');
	// 		return;
	// 	}
	// 	if (playerAllowsSound) {
	// 		audioObj.door.play();
	// 	}

	// 	if (playerAllowsMusic) {
	// 		playMusicOnLoop(audioObj.creepyWhistlyMusic);
	// 		audioObj.darkAmbientMusic.pause();
	// 	}
	// 	gameContainer.showModal();
	// 	initLastQuizGame();
	// };

	// This function displays the third mini game
	const miniGame4 = () => {
		if (playerAllowsSound) {
			audioObj.door.play();
		}
		if (playerAllowsMusic) {
			playMusicOnLoop(audioObj.creepyWhistlyMusic);
			audioObj.darkAmbientMusic.pause();
		}
		gameContainer.showModal();
		handlePlay();
	};

	/*This function finds the id of the clicked button
	 * passed from the event listener
	 * and calls the respective function
	 * to displays the clicked mini game
	 */
	const displayMiniGames = (id) => {
		if (id == 'door2') {
			// miniGame2();
		} else if (id == 'door3') {
			miniGame3();
		} else if (id == 'door4') {
			miniGame4();
		}
	};
});
