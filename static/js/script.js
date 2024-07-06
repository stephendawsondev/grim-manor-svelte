// jshint esversion: 6

// Minigames code
import { startMemoryGame } from './minigames/memory-game.js';
import { handlePlay } from './minigames/quiz.js';
import { initLastQuizGame } from './minigames/lastquiz.js';
import { showDialogueAsync } from './utils/dialogueGeneration.js';
import { savePlayerData, loadPlayerData, updateLocalProperty } from './utils/gamedataLocalstore.js';
import {
	userAllowsMusic,
	userAllowsSounds,
	loadAudio,
	addAudioIconEventListeners
} from './utils/audioSettings.js';
import {
	introDialogue,
	returnedButIncomplete,
	notEnoughCluesDialogue,
	memoryGameInitialDialgoue
} from './utils/dialogues.js';

let url_audios_deploy = '../..';

const setVideoSource = () => {
	const videoElement = document.querySelector('#haunted-mansion video source');
	const windowWidth = window.innerWidth;
	// Set the source based on screen width if on the landing page
	if (windowWidth <= 600) {
		videoElement.src = `${url_audios_deploy}/images/haunted-mansion-mobile.webm`;
	} else if (windowWidth <= 1024) {
		videoElement.src = `${url_audios_deploy}/images/haunted-mansion-tablet.webm`;
	} else {
		videoElement.src = `${url_audios_deploy}/images/haunted-mansion.webm`;
	}
	// Explicitly tell the video element to load the new source
	videoElement.parentElement.load();
};

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

	let loadedPlayerData = loadPlayerData();
	const audioObj = loadAudio(url_audios_deploy);
	addAudioIconEventListeners(url_audios_deploy);

	if (!loadedPlayerData.landingPageComplete) {
		const hauntedMansionView = document.getElementById('haunted-mansion');
		const enterButton = document.getElementById('landing-enter');
		if (userAllowsSounds) {
			playMusicOnLoop(audioObj.thunderstorm);
		}
		hauntedMansionView.classList.add('in-play');
		setVideoSource();
		// Listen for window resize
		window.addEventListener('resize', setVideoSource);

		enterButton.addEventListener('click', () => {
			hauntedMansionView.classList.remove('in-play');
			mansionView.classList.add('in-play');
			if (userAllowsSounds) {
				audioObj.thunderstorm.pause();
			}
			if (userAllowsMusic) {
				playMusicOnLoop(audioObj.darkAmbientMusic);
			}
			savePlayerData({
				...loadedPlayerData,
				landingPageComplete: true
			});
		});
	} else {
		mansionView.classList.add('in-play');
	}

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
		if (userAllowsMusic) {
			audioObj.creepyWhistlyMusic.pause();
			playMusicOnLoop(audioObj.darkAmbientMusic);
		}
	});
	const ghost = document?.querySelector('.ghost-image');
	if (ghost) {
		ghost.classList.add('active');
	}

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
	if (loadedPlayerData.firstTimePlaying) {
		await showDialogueAsync(introDialogue);
		updateLocalProperty('firstTimePlaying', false);
	} else {
		await showDialogueAsync(returnedButIncomplete);
	}

	// loop through 'interactive' and enable
	for (const button of interactiveButtons) {
		button.disabled = false;
		button.classList.remove('disabled');
		button.setAttribute('aria-disabled', 'false');
	}
	ghost.classList.remove('active');

	// -------- Mini games functions ---------

	// (window.location.href = "game1.html");

	// This function displays the second mini game
	const miniGame3 = async () => {
		gameContainer.showModal();
		gameContainer.classList.add('boy-ghost');

		if (userAllowsSounds) {
			audioObj.stairs.play();
		}
		if (userAllowsMusic) {
			playMusicOnLoop(audioObj.creepyWhistlyMusic);
		}
		await showDialogueAsync(memoryGameInitialDialgoue, true);
		startMemoryGame();
	};

	// This function displays the lastquiz mini game
	const miniGame2 = async () => {
		loadedPlayerData = loadPlayerData();
		if (
			!loadedPlayerData.hangmanClueObtained ||
			!loadedPlayerData.memoryClueObtained ||
			!loadedPlayerData.quizClueObtained
		) {
			// alert("You need to complete the three games first!");
			ghost.classList.add('active');
			await showDialogueAsync(notEnoughCluesDialogue);
			ghost.classList.remove('active');
			return;
		}
		if (userAllowsSounds) {
			audioObj.door.play();
		}

		if (userAllowsMusic) {
			playMusicOnLoop(audioObj.creepyWhistlyMusic);
			audioObj.darkAmbientMusic.pause();
		}
		gameContainer.showModal();
		initLastQuizGame();
	};

	// This function displays the third mini game
	const miniGame4 = () => {
		if (userAllowsSounds) {
			audioObj.door.play();
		}
		if (userAllowsMusic) {
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
			miniGame2();
		} else if (id == 'door3') {
			miniGame3();
		} else if (id == 'door4') {
			miniGame4();
		}
	};
});
