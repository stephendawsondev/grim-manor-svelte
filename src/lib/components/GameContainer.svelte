<script lang="ts">
	import Hangman from './Hangman.svelte';
	import Memory from './Memory.svelte';
	import Quiz from './Quiz.svelte';

	let { gameName } = $props();
</script>

<div id="game-container">
	{#if gameName === 'hangman'}
		<Hangman />
	{:else if gameName === 'memory'}
		<Memory />
	{:else if gameName === 'quiz'}
		<Quiz />
	{/if}

	<!-- <div class="minigame" id="game-lastquiz">
		<div class="game-area-lastquiz">
			<button id="a" class="button-lastquiz"></button>
			<button id="b" class="button-lastquiz"></button>
			<button id="c" class="button-lastquiz"></button>
		</div>
		<h5 id="question"></h5>
		<p id="evaluation"></p>
	</div> -->
</div>
