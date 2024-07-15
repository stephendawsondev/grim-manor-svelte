import { browser } from '$app/environment';
import { setContext, getContext } from 'svelte';

export class LocalStorage<T> {
	value = $state<T>() as T;
	key: string = '';
	constructor(key: string, initialValue: T) {
		this.key = key;
		this.value = initialValue;

		if (browser) {
			const item = localStorage.getItem(key);
			if (item) this.value = this.deserialise(item);
		}

		$effect(() => {
			localStorage.setItem(this.key, this.serialise(this.value));
		});
	}

	serialise = (value: T): string => {
		return JSON.stringify(value);
	};

	deserialise = (value: string) => {
		return JSON.parse(value);
	};
}

interface UserData {
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

const USER_DATA = Symbol('USER_DATA');

export const setUserDataContext = (userData: LocalStorage<UserData>) => {
	setContext(USER_DATA, userData);
	return userData.value;
};

export const getUserDataContext = () => {
	return getContext<LocalStorage<UserData>>(USER_DATA);
};

export class AudioManager {
	userData = $state();
	audioFiles: Record<string, string>;
	audioObjects: Record<string, HTMLAudioElement> = {};

	constructor(userData: LocalStorage<UserData>, audioFiles: Record<string, string>) {
		this.userData = userData;
		this.audioFiles = audioFiles;
		if (browser) {
			this.audioObjects = this.loadAudio();
		}
	}

	loadAudio = () => {
		const audioObjects: Record<string, HTMLAudioElement> = {};
		for (const [key, fileName] of Object.entries(this.audioFiles)) {
			audioObjects[key] = new Audio(`/audio/${fileName}`);
		}
		return audioObjects;
	};

	playAudio = (key: string) => {
		const audio = this.audioObjects[key];
		if (audio) {
			audio.play().catch((err) => console.error('Error playing audio:', err));
		} else {
			console.warn(`Audio file ${key} not found`);
		}
	};

	playAudioLoop = (key: string) => {
		const audio = this.audioObjects[key];
		if (audio) {
			audio.loop = true;
			audio.play().catch((err) => console.error('Error playing audio:', err));
		} else {
			console.warn(`Audio file ${key} not found`);
		}
	};

	stopAudio = (key: string) => {
		const audio = this.audioObjects[key];
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		} else {
			console.warn(`Audio file ${key} not found`);
		}
	};
}

const AUDIO_MANAGER = Symbol('AUDIO_MANAGER');

export const setAudioManagerContext = (audioManager: AudioManager) => {
	setContext(AUDIO_MANAGER, audioManager);
	return audioManager;
};

export const getAudioManagerContext = () => {
	return getContext<AudioManager>(AUDIO_MANAGER);
};
