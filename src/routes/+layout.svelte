<script lang="ts">
	import {
		LocalStorage,
		setUserDataContext,
		AudioManager,
		setAudioManagerContext
	} from '$lib/index.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let userData = new LocalStorage('userData', {
		playerName: 'Stranger',
		firstTimePlaying: true,
		landingPageComplete: false,
		storyComplete: false,
		hangmanClueObtained: false,
		memoryClueObtained: false,
		quizClueObtained: false,
		backDoorOpened: false,
		playerAllowsMusic: false,
		playerAllowsSound: false,
		currentlyPlaying: 'darkAmbientMusic'
	});

	setUserDataContext(userData);

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

	const audioManager = new AudioManager(userData, audioFiles);

	setAudioManagerContext(audioManager);

	function toggleMusic() {
		userData.value = {
			...userData.value,
			playerAllowsMusic: !userData.value.playerAllowsMusic
		};
	}

	function toggleSound() {
		userData.value = {
			...userData.value,
			playerAllowsSound: !userData.value.playerAllowsSound
		};
	}
</script>

<main>
	{@render children()}
</main>

{#await userData}
	<!-- promise is pending -->
{:then value}
	<button
		title="Toggle music"
		id="music-button"
		class="audio-button music-button"
		onclick={toggleMusic}
	>
		<img
			id="music-icon"
			src={userData.value.playerAllowsMusic ? '/images/music_on.webp' : '/images/music_off.webp'}
			alt="music icon"
		/>
	</button>

	<button
		title="Toggle sound"
		id="sound-button"
		class="audio-button sound-button"
		onclick={toggleSound}
	>
		<img
			id="sound-icon"
			src={userData.value.playerAllowsSound ? '/images/sound_on.webp' : '/images/sound_off.webp'}
			alt="sound icon"
		/>
	</button>
{:catch error}
	<!-- promise was rejected -->
{/await}

<style>
	.audio-button {
		position: fixed;
		border: none;
		top: 5px;
		left: 5px;
		z-index: 5;
		background-color: transparent;
		opacity: 0.5;
		pointer-events: all;
	}

	.music-button {
		top: 5px;
		left: 5px;
		z-index: 6;
	}

	.sound-button {
		top: 5px;
		left: 50px;
		z-index: 6;
	}
</style>
