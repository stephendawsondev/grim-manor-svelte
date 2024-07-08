// jshint esversion: 6

// Minigames code
import { startMemoryGame } from '/js/minigames/memory-game.js';
import { handlePlay } from '/js/minigames/quiz.js';
import { initLastQuizGame } from '/js/minigames/lastquiz.js';
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
	const gameContainer = document.getElementById('game-container'); // Select the container for the minigames

	const minigames = document.querySelectorAll('.minigame');
	for (const minigame of minigames) {
		minigame.classList.remove('active');
	}

	await showDialogueAsync(returnedButIncomplete);

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
});
