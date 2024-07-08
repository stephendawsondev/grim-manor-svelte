const audioFiles = {
	ghostScream: 'ghost-scream.mp3',
	spookyGhostWind: 'spooky-ghost-wind.mp3',
	stairs: 'stairs.mp3',
	thunderstorm: 'thunderstorm.mp3',
	windAndDread: 'wind-and-dread.mp3',
	darkAmbientMusic: 'dark-ambient-music.mp3',
	door: 'door.mp3',
	creepyWhistlyMusic: 'creepy-whistly-music.mp3'
};

let playerAllowsSound, playerAllowsMusic;

const loadPlayerSettings = () => {
	const loadedData = loadPlayerData();
	if (loadedData) {
		playerAllowsSound = loadedData.playerAllowsSound;
		playerAllowsMusic = loadedData.playerAllowsMusic;
	}

	if (playerAllowsMusic && playerAllowsSound) {
		loadPlayerSettings();
	}
};

/**
 * Loads the audio files
 * @returns {Object} audioObjects
 */
const loadAudio = (url) => {
	const audioObjects = {};

	for (const [key, fileName] of Object.entries(audioFiles)) {
		audioObjects[key] = new Audio(`${url}/audio/${fileName}`);
	}

	return audioObjects;
};

const addAudioIconEventListeners = () => {
	// Load initial states from local storage
	const loadedPlayerData = loadPlayerData();
	playerAllowsMusic = loadedPlayerData.playerAllowsMusic;
	playerAllowsSound = loadedPlayerData.playerAllowsSound;

	// Update icons based on initial state
	const musicIcon = document.getElementById('music-icon');
	const soundIcon = document.getElementById('sound-icon');
	musicIcon.src = playerAllowsMusic ? `/images/music_on.webp` : `/images/music_off.webp`;
	soundIcon.src = playerAllowsSound ? `/images/sound_on.webp` : `/images/sound_off.webp`;

	// Add event listeners
	const musicButton = document.getElementById('music-button');
	const soundButton = document.getElementById('sound-button');

	musicButton.addEventListener('click', (event) => {
		event.stopPropagation();
		playerAllowsMusic = !playerAllowsMusic;
		savePlayerData({ ...loadedPlayerData, playerAllowsMusic: playerAllowsMusic });
		musicIcon.src = playerAllowsMusic ? `/images/music_on.webp` : `/images/music_off.webp`;
	});

	soundButton.addEventListener('click', () => {
		playerAllowsSound = !playerAllowsSound;
		savePlayerData({
			...loadedPlayerData,
			playerAllowsSound: playerAllowsSound
		});
		soundIcon.src = playerAllowsSound ? `/images/sound_on.webp` : `/images/sound_off.webp`;
	});
};

export { playerAllowsMusic, playerAllowsSound, loadAudio, addAudioIconEventListeners };
