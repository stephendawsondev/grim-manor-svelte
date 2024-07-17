<script lang="ts">
	import Spirit from '$lib/components/Spirit.svelte';
	import { getAudioManagerContext, getUserDataContext } from '$lib/index.svelte';
	import { showDialogueAsync } from '$lib/utils/dialogueGeneration';
	import type { DialogueItem } from '$lib/types';
	import { onMount } from 'svelte';

	let userData = getUserDataContext().value;
	if (userData.hangmanClueObtained && userData.memoryClueObtained && userData.quizClueObtained) {
		userData.backDoorOpened = true;
	}

	userData.currentlyPlaying = 'darkAmbientMusic';

	let audioManager = getAudioManagerContext();

	const introDialogue: DialogueItem[] = [
		{
			text: 'Pale man: Hello?',
			choices: [
				{
					text: 'Are you a ghost?',
					action: () => ({
						newDialogue: { text: 'I think... I am' }
					})
				},
				{
					text: 'Are you okay?',
					action: () => ({
						newDialogue: { text: 'I think... I am a ghost' }
					})
				}
			]
		},
		{
			text: '',
			choices: [
				{
					text: 'Are you a friendly ghost?',
					action: () => ({
						newDialogue: { text: 'I am, but there are others here...' }
					})
				},
				{
					text: 'Should I run away screaming?',
					action: () => ({
						newDialogue: { text: 'Not from me...' }
					})
				}
			]
		},
		{
			text: "It's very cold outside.",
			choices: [
				{
					text: 'Can I stay a while?',
					action: () => ({
						newDialogue: {
							text: 'That depends, will you help me with something?'
						}
					})
				},
				{
					text: 'Is it safe for me here?',
					action: () => ({
						newDialogue: {
							text: 'I can keep you safe, if you help me with something.'
						}
					})
				}
			]
		},
		{
			text: 'I need help finding out why I am stuck here in this house...',
			choices: [
				{
					text: 'But I scare easily...',
					action: () => ({
						newDialogue: {
							text: 'You’ll be fine.'
						}
					})
				},
				{
					text: 'I can help you.',
					action: () => ({
						newDialogue: {
							text: 'Thank you.'
						}
					})
				}
			]
		},
		{
			text: 'I have been trapped in this house for centuries.. able only to be seen by the human realm on Halloween...'
		},
		{
			text: 'I do not know why I am trapped, but I am sure that if I knew why I died then I would be able to move on...'
		},
		{
			text: 'There are many clues hidden in this house – can you help me by finding them?'
		}
	];

	const returnedButIncomplete: DialogueItem[] = [
		{
			text: 'You have returned, thank you for your help so far...'
		}
	];

	onMount(async () => {
		if (userData.playerAllowsMusic) {
			audioManager.stopAudio('creepyWhistlyMusic');
			audioManager.playAudioLoop('darkAmbientMusic');
		}
		if (!userData.storyComplete) {
			const ghost = document?.querySelector('.ghost-image');

			if (ghost) {
				ghost.classList.add('active');
			}

			if (userData.firstTimePlaying == true) {
				await showDialogueAsync(introDialogue);
			} else {
				await showDialogueAsync(returnedButIncomplete);
			}
			userData.firstTimePlaying = false;
			ghost?.classList.remove('active');
		} else {
			await showDialogueAsync([
				{ text: 'The young man is no longer appearing... he must have moved on.' }
			]);
		}
	});
</script>

<section id="mansion-container" class="main-page">
	<img id="background-image" src="/images/scary-mansion.webp" alt="" />
	<div class="overlay-container">
		<a
			href="hangman"
			class="interactive"
			id="door1"
			onclick={() => audioManager.stopAudio('darkAmbientMusic')}
		>
			<Spirit duration={12} color={userData.hangmanClueObtained ? 'white' : '#6ab5cd'} />
		</a>
		{#if userData.backDoorOpened}
			<a
				href="last-quiz"
				class="interactive"
				id="door2"
				onclick={() => audioManager.stopAudio('darkAmbientMusic')}
			>
				{#if !userData.storyComplete}
					<Spirit duration={3} color={userData.storyComplete ? 'white' : 'red'} />
				{/if}
			</a>
		{/if}
		<a
			href="memory"
			class="interactive"
			id="door3"
			onclick={() => audioManager.stopAudio('darkAmbientMusic')}
		>
			<Spirit duration={10} color={userData.memoryClueObtained ? 'white' : '#6ab5cd'} />
		</a>
		<a
			href="quiz"
			class="interactive"
			id="door4"
			onclick={() => audioManager.stopAudio('darkAmbientMusic')}
		>
			<Spirit duration={8} color={userData.quizClueObtained ? 'white' : '#6ab5cd'} />
		</a>
	</div>
	<div class="ghost-container">
		<img
			src="/images/ghostly-man-image.png"
			alt="young male ghost in olden-day clothes"
			class="ghost-image"
		/>
	</div>

	<aside id="dialogue-box" class="dialogue-box" role="dialog">
		<p id="dialogue-text" class="dialogue-text"></p>
		<div id="choices-container" class="choices-container"></div>
		<svg
			width="40px"
			height="40px"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			class="chevron-right"
		>
			<g>
				<path
					id="Vector"
					d="M10 8L14 12L10 16"
					stroke="#000000"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
		</svg>
	</aside>
</section>

<style>
	/* Mansion container css */
	#mansion-container {
		position: relative;
		float: left;
		height: 100vh;
		overflow: hidden;
		position: relative;
		min-width: 1792px;
		width: 100%;
	}

	#mansion-container #background-image {
		width: 100%;
		height: 100%;
	}

	.overlay-container {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.interactive {
		background-color: transparent;
		opacity: 1;
		pointer-events: all;
		border: none;
		cursor: pointer;
	}

	#door1 {
		position: absolute;
		top: 60%;
		left: 24%;
		width: 120px;
		height: 320px;
	}

	#door2 {
		position: absolute;
		top: 60%;
		left: 42%;
		width: 100px;
		height: 210px;
	}

	#door3 {
		position: absolute;
		top: 60%;
		left: 60%;
		width: 150px;
		height: 300px;
	}

	#door4 {
		position: absolute;
		top: 60%;
		left: 75%;
		width: 150px;
		height: 280px;
	}
	/* End Mansion css styles */
	/* Ghost css */
	.ghost-container {
		bottom: 0;
		left: 100px;
		width: 90%;
		height: 48%;
		pointer-events: none;
	}

	.ghost-image {
		position: absolute;
		z-index: 1;
		opacity: 0;
		transition: opacity 2s ease-in-out;
		left: 46%;
		bottom: 1%;
	}

	.ghost-image:global(.active) {
		opacity: 0.8;
	}

	@media screen and (min-width: 1024px) {
		.ghost-image {
			width: 150px;
		}
	}
</style>
