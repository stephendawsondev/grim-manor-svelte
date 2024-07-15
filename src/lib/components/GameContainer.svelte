<script lang="ts">
	import Hangman from './Hangman.svelte';
	import Memory from './Memory.svelte';
	import Quiz from './Quiz.svelte';
	import LastQuiz from './LastQuiz.svelte';
	import { getUserDataContext } from '$lib/index.svelte';

	let { gameName } = $props();

	let gameContainerBackground = $state('');
	let bgOverlay = $state('');

	let userData = getUserDataContext().value;

	userData.currentlyPlaying = 'creepyWhistlyMusic';

	function updateContainerBackground(imgUrl: string, hasOverlay: boolean = false): void {
		gameContainerBackground = imgUrl;
		bgOverlay = hasOverlay
			? 'linear-gradient(rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.55))'
			: '';
	}
</script>

<div
	id="game-container"
	style="background-image: {bgOverlay ? bgOverlay + ',' : ''}url('{gameContainerBackground}');"
>
	{#if gameName === 'hangman'}
		<Hangman {updateContainerBackground} />
	{:else if gameName === 'memory'}
		<Memory {updateContainerBackground} />
	{:else if gameName === 'quiz'}
		<Quiz {updateContainerBackground} />
	{:else if gameName === 'last-quiz'}
		<LastQuiz {updateContainerBackground} />
	{/if}
</div>
