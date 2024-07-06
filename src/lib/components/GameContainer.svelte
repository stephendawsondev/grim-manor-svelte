<script>
	import Hangman from './Hangman.svelte';
	import Memory from './Memory.svelte';
	import Quiz from './Quiz.svelte';
</script>

<div id="game-container">
	<Hangman />
	<!-- <Memory />
	<Quiz /> -->

	<div class="minigame" id="game-lastquiz">
		<div class="game-area-lastquiz">
			<button id="a" class="button-lastquiz"></button>
			<button id="b" class="button-lastquiz"></button>
			<button id="c" class="button-lastquiz"></button>
		</div>
		<h5 id="question"></h5>
		<p id="evaluation"></p>
	</div>
</div>
