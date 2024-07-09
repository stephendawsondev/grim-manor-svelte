<script lang="ts">
	import { onMount } from 'svelte';
	import MemoryCard from './MemoryCard.svelte';
	import { getUserDataContext, getAudioManagerContext } from '$lib/index.svelte';
	import { showDialogueAsync } from '$lib/utils/dialogueGeneration';
	import { memoryGameInitialDialogue, memoryGameEndDialogue } from '$lib/utils/dialogues';

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
	}

	let userData = getUserDataContext().value as UserData;
	let audioManager = getAudioManagerContext();

	onMount(async () => {
		const gameContainer = document.getElementById('game-container') as HTMLDivElement;
		gameContainer?.classList.add('boy-ghost');

		const cards = Array.from(document.querySelectorAll('.memory-card')) as HTMLDivElement[];
		let hasFlippedCard = false;
		let lockBoard = false;
		let firstCard: HTMLDivElement | null = null;
		let secondCard: HTMLDivElement | null = null;
		let matchedPairs = 0;
		const totalPairs = cards.length / 2;
		let gameTimer: ReturnType<typeof setTimeout>;

		cards.forEach((card) => {
			card.addEventListener('click', flipCard as EventListener);
		});

		function flipCard(this: HTMLDivElement) {
			if (lockBoard || this === firstCard) return;
			this.classList.add('flip');

			if (!hasFlippedCard) {
				hasFlippedCard = true;
				firstCard = this;
				return;
			}

			secondCard = this;
			checkForMatch();
		}

		function checkForMatch() {
			const isMatch = firstCard!.dataset.framework === secondCard!.dataset.framework;
			isMatch ? disableCards() : unflipCards();
		}

		async function disableCards() {
			firstCard!.removeEventListener('click', flipCard);
			secondCard!.removeEventListener('click', flipCard);

			matchedPairs++;
			if (matchedPairs === totalPairs) {
				clearTimeout(gameTimer);
				userData.memoryClueObtained = true;
				document.getElementById('memory-game')!.classList.remove('active');
				await showDialogueAsync(memoryGameEndDialogue, true);
			}

			resetBoard();
		}

		function unflipCards() {
			lockBoard = true;

			setTimeout(() => {
				firstCard!.classList.remove('flip');
				secondCard!.classList.remove('flip');
				resetBoard();
			}, 1000);
		}

		function resetBoard() {
			[hasFlippedCard, lockBoard] = [false, false];
			[firstCard, secondCard] = [null, null];
		}

		function shuffleCards() {
			cards.forEach((card) => {
				let randomPos = Math.floor(Math.random() * cards.length);
				card.style.order = randomPos.toString();
			});
		}

		function startMemoryGame() {
			shuffleCards();
			document.getElementById('memory-game')!.classList.add('active');
			gameTimer = setTimeout(() => {
				document.getElementById('memory-game')!.classList.remove('active');
				showDialogueAsync("Time's up! Try again.", true);
			}, 60000);
		}

		if (userData.playerAllowsSound) {
			audioManager.playAudio('stairs');
		}
		if (userData.playerAllowsMusic) {
			audioManager.playAudioLoop('creepyWhistlyMusic');
		}

		await showDialogueAsync(memoryGameInitialDialogue, true);
		startMemoryGame();
	});

	const CARD_NAMES: Array<string> = [
		'death',
		'the_fool',
		'the_hanged_man',
		'justice',
		'the_hermit',
		'the_moon'
	];
	const CARD_PAIRS = [...CARD_NAMES, ...CARD_NAMES];
</script>

<div class="minigame" id="memory-game">
	{#each CARD_PAIRS as cardName, index (index)}
		<MemoryCard {cardName} />
	{/each}
</div>

<style>
	/* Memory mini-game styles */
	#memory-game {
		width: 100%;
		height: 100%;
		display: none;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		padding: 15px;
		justify-content: center;
		align-content: center;
	}

	#memory-game:global(.active) {
		display: grid;
	}

	:global(.boy-ghost) {
		background-image: url('/images/boy-ghost.webp');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	@media screen and (min-width: 768px) {
		#memory-game {
			margin: 0 auto;
			width: 80%;
			padding: 3em;
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media screen and (min-width: 900px) {
		#memory-game {
			width: 60%;
			grid-template-columns: repeat(6, 1fr);
		}
	}
</style>
