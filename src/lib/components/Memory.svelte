<script lang="ts">
	import { onMount } from 'svelte';
	import MemoryCard from './MemoryCard.svelte';
	import { getUserDataContext, getAudioManagerContext } from '$lib/index.svelte';
	import { showDialogueAsync } from '$lib/utils/dialogueGeneration';
	import type { DialogueItem, UserData } from '$lib/types';

	let { updateContainerBackground }: { updateContainerBackground: (background: string) => void } =
		$props();

	let showEndCard: boolean = $state(false);

	const memoryGameInitialDialogue: DialogueItem[] = [
		{
			text: 'You walk to the stairs, where a young boy is sitting and playing a card game. His clothing is old, from another time. '
		},
		{
			text: 'He is not transparent as the first young man you encountered was, but there is a translucence to his skin.'
		},
		{
			text: 'He looks at you with haunted eyes.'
		},
		{
			text: '“To discover the secrets of this house, choose the correct cards but you must remember where they lie...”'
		}
	];

	const memoryGameEndDialogue: DialogueItem[] = [
		{
			text: 'In his high child’s voice, the boy says:'
		},
		{
			text: '“The man who owned this house hung himself many years ago…”'
		},
		{
			text: '“They say his spirit still haunts these halls...”'
		}
	];

	const returnIntroDialogue: DialogueItem[] = [
		{
			text: '"Have you come to play with me again?"'
		}
	];

	const returnWinDialogue: DialogueItem[] = [
		{
			text: '"Please don\'t leave me alone..."'
		}
	];

	let userData = getUserDataContext().value as UserData;
	let audioManager = getAudioManagerContext();

	onMount(async () => {
		updateContainerBackground('/images/boy-ghost.webp');

		const cards = Array.from(document.querySelectorAll('.memory-card')) as HTMLDivElement[];
		let hasFlippedCard = false;
		let lockBoard = false;
		let firstCard: HTMLDivElement | null = null;
		let secondCard: HTMLDivElement | null = null;
		let matchedPairs = 0;
		const totalPairs = cards.length / 2;

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
				if (userData.memoryClueObtained) {
					await showDialogueAsync(returnWinDialogue);
				} else {
					await showDialogueAsync(memoryGameEndDialogue);
				}
				userData.memoryClueObtained = true;
				document.getElementById('memory-game')!.classList.remove('active');

				showEndCard = true;
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
		}

		if (userData.playerAllowsSound) {
			audioManager.playAudio('stairs');
		}
		if (userData.playerAllowsMusic) {
			audioManager.playAudioLoop('creepyWhistlyMusic');
		}

		if (userData.memoryClueObtained) {
			await showDialogueAsync(returnIntroDialogue);
		} else {
			await showDialogueAsync(memoryGameInitialDialogue);
		}
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
{#if showEndCard}
	<div class="card end-card">
		<p>Leave now?</p>
		<a href="/" class="btn exit-btn">Exit</a>
	</div>
{/if}

<style>
	/* Memory mini-game styles */
	.card {
		background-color: #2a2a2a;
		padding: 20px;
		border-radius: 8px;
		margin: 10px 0;
		width: 100%;
		max-width: 500px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%);
		color: #fafafa;

		.btn {
			background-color: #fafafa;
			color: #1a1a1a;
			border: none;
			padding: 10px 20px;
			margin: 5px;
			border-radius: 4px;
			cursor: pointer;
			font-weight: bold;
			text-decoration: none;
			transition: all 0.3s ease;
			&:hover {
				background-color: #1a2227;
				color: #fafafa;
				transform: scale(1.05);
			}
		}
	}

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
