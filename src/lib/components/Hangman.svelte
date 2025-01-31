<script lang="ts">
	import { showDialogueAsync } from '$lib/utils/dialogueGeneration';
	import { halloweenWords } from '$lib/gameWords';
	import { onMount } from 'svelte';
	import { getUserDataContext, getAudioManagerContext } from '$lib/index.svelte';
	import type { DialogueItem } from '$lib/types';

	let {
		updateContainerBackground
	}: { updateContainerBackground: (background: string, hasOverlay?: boolean) => void } = $props();

	let userData = getUserDataContext().value;
	let audioManager = getAudioManagerContext();
	let showEndCard: boolean = $state(false);
	let hangmanContainer: HTMLDivElement | null;
	let alphabetOne: string[] = 'ABCDEFGHIJKLMN'.split('');
	let alphabetTwo: string[] = 'OPQRSTUVWXYZ'.split('');

	const hangmanIntroDialogue: DialogueItem[] = [
		{
			text: 'You try the door on the left and enter a cluttered, dimly lit room.'
		},
		{
			text: 'The smell of damp and incense hangs heavy in the air.'
		},
		{
			text: 'A wizened old woman sits at a table in the centre of the room, surrounded my many dusty trinkets and books.'
		},
		{ text: 'In front of her she has a Ouija board...' }
	];

	const hangmanWinDialogue: DialogueItem[] = [
		{
			text: 'They say the young man’s fiancée married another man…'
		}
	];

	const hangmanLoseDialogue: DialogueItem[] = [
		{
			text: "I'm sorry, dear... not this time..."
		}
	];

	const hangmanReturnDialogue: DialogueItem[] = [
		{
			text: 'Welcome back, dear... you already know the young man’s fiancée married another man…'
		},
		{
			text: 'But please, stay and chat...'
		}
	];

	const gameState: {
		guessedLetters: string[];
		incorrectGuessCount: number;
		phraseArr: string;
	} = $state({
		guessedLetters: [],
		incorrectGuessCount: 0,
		phraseArr: ''
	});

	const drawInitialScene = () => {
		if (document.getElementById('stickman')) {
			const canvas =
				(document?.getElementById('stickman') as HTMLCanvasElement) ||
				document.createElement('canvas');
			const context = canvas?.getContext('2d') || new CanvasRenderingContext2D();

			context.lineWidth = 4;

			context.beginPath();
			context.moveTo(20, 180);
			context.lineTo(180, 180);
			context.moveTo(100, 180);
			context.lineTo(100, 40);
			context.lineTo(160, 40);
			context.lineTo(160, 80);
			context.stroke();

			context.beginPath();
			context.moveTo(160, 80);
			context.lineTo(160, 80);
			context.stroke();
		}
	};

	const drawHangman = () => {
		const canvas: HTMLCanvasElement | null = document.getElementById(
			'stickman'
		) as HTMLCanvasElement;
		const context = canvas?.getContext('2d') ?? new CanvasRenderingContext2D();
		context.lineWidth = 4;

		switch (gameState.incorrectGuessCount) {
			case 0:
				// Draw hanging apparatus
				context.beginPath();
				context.moveTo(20, 180);
				context.lineTo(180, 180);
				context.moveTo(100, 180);
				context.lineTo(100, 40);
				context.lineTo(160, 40);
				context.lineTo(160, 80);
				context.stroke();
				break;
			case 1:
				// Draw head
				context.beginPath();
				context.arc(160, 90, 10, 0, Math.PI * 2);
				context.stroke();
				break;
			case 2:
				// Draw body
				context.beginPath();
				context.moveTo(160, 100);
				context.lineTo(160, 140);
				context.stroke();
				break;
			case 3:
				// left arm
				context.beginPath();
				context.moveTo(160, 110);
				context.lineTo(145, 125);
				context.stroke();
				break;
			case 4:
				// right arm
				context.beginPath();
				context.moveTo(160, 110);
				context.lineTo(175, 125);
				context.stroke();
				break;
			case 5:
				// left leg
				context.beginPath();
				context.moveTo(160, 140);
				context.lineTo(145, 155);
				context.stroke();
				break;
			case 6:
				// right leg
				context.beginPath();
				context.moveTo(160, 140);
				context.lineTo(175, 155);
				context.stroke();
				break;
		}
	};

	const checkGameStatus = async (phrase: string) => {
		// Check if won
		const letterSpans = document.querySelectorAll('.hangman-letter');
		const revealedSpans = document.querySelectorAll('.hangman-letter.revealed');
		if (letterSpans.length === revealedSpans.length) {
			hangmanContainer?.classList.remove('active');
			updateContainerBackground('/images/lonely-old-woman.webp');
			userData.hangmanClueObtained = true;
			if (userData.hangmanClueObtained) {
				await showDialogueAsync([
					{
						text: `Yes, dear... "${phrase}" is correct... well done...`
					}
				]);
				showEndCard = true;
			} else {
				await showDialogueAsync(hangmanWinDialogue, true);
				showEndCard = true;
			}

			return 'won';
		}

		// Check if lost
		if (gameState.incorrectGuessCount >= 6) {
			hangmanContainer?.classList.remove('active');
			updateContainerBackground('/images/lonely-old-woman.webp');
			if (userData.hangmanClueObtained) {
				await showDialogueAsync([{ text: `Silly child... it was clearly "${phrase}"...` }]);
				showEndCard = true;
			} else {
				await showDialogueAsync(hangmanLoseDialogue);
				showEndCard = true;
			}
		}

		return 'ongoing';
	};

	let checkLetter = (event: MouseEvent) => {
		const phraseArr = gameState.phraseArr.split('');
		let buttonElement = event.target as HTMLButtonElement;
		let letter = buttonElement?.innerText ?? '';
		if (gameState.guessedLetters.includes(letter)) return;

		gameState.guessedLetters.push(letter);
		if (!phraseArr.map((letter) => letter.toUpperCase()).includes(letter.toUpperCase())) {
			gameState.incorrectGuessCount++;
			drawHangman();
		}
		// Disable the button and change its appearance
		buttonElement.disabled = true;
		buttonElement.classList.add('disabled');
		buttonElement.setAttribute('aria-disabled', 'true');

		const letterSpans = document.querySelectorAll('.hangman-letter');

		for (const span of letterSpans) {
			const dataset = (span as HTMLElement).dataset;
			if (
				gameState.guessedLetters
					.map((letter) => letter.toUpperCase())
					.includes(dataset.letter?.toUpperCase() ?? '')
			) {
				span.textContent = dataset.letter ?? '';
				span.classList.add('revealed');
			}
		}
		const status = checkGameStatus(gameState.phraseArr);
	};

	const resetGame = () => {
		gameState.guessedLetters.length = 0;
		gameState.incorrectGuessCount = 0;

		// reset canvas
		const canvas: HTMLCanvasElement | null = document.getElementById(
			'stickman'
		) as HTMLCanvasElement;
		const context = canvas?.getContext('2d') ?? new CanvasRenderingContext2D();
		context.clearRect(0, 0, canvas.width, canvas.height);

		// reset letter buttons
		const letterButtons = [...document.querySelectorAll('.ouija-board-alphabet-letter')].filter(
			(el): el is HTMLButtonElement => el instanceof HTMLButtonElement
		);
		for (const button of letterButtons) {
			button.disabled = false;
			button.classList.remove('disabled');
			button.setAttribute('aria-disabled', 'false');
		}
	};

	const runHangmanGame = async () => {
		// reset the game
		resetGame();

		const initialClue = 'She loved someone else';
		const newClue = halloweenWords[Math.floor(Math.random() * halloweenWords.length)];

		gameState.phraseArr = userData.hangmanClueObtained ? newClue : initialClue;

		updateContainerBackground('/images/lonely-old-woman.webp');
		let dialogue = userData.hangmanClueObtained ? hangmanReturnDialogue : hangmanIntroDialogue;
		await showDialogueAsync(dialogue);
		updateContainerBackground('/images/wooden-table.webp', true);
		hangmanContainer?.classList.add('active');
		drawInitialScene();

		const hangmanPhrase = document?.querySelector('.hangman-phrase');

		// check if letters letterContainer is empty
		if (hangmanPhrase?.hasChildNodes()) {
			hangmanPhrase.innerHTML = '';
		}
		for (const letter of gameState.phraseArr) {
			const letterContainer = document.createElement('div');
			letterContainer.classList.add('hangman-letter-container');
			const letterSpan = document.createElement('span');

			if (letter !== ' ') {
				letterSpan.classList.add('hangman-letter');
				letterSpan.dataset.letter = letter;
			} else {
				letterContainer.classList.add('hangman-letter-space');
			}

			letterContainer.appendChild(letterSpan);
			hangmanPhrase?.appendChild(letterContainer);
		}

		// Add event listeners to letter buttons
		const letterButtons = [...document.querySelectorAll('.ouija-board-alphabet-letter')].filter(
			(el): el is HTMLButtonElement => el instanceof HTMLButtonElement
		);
		for (const button of letterButtons) {
			if (gameState.guessedLetters.includes(button.innerText)) {
				button.disabled = true;
				button?.classList.add('disabled');
				button?.setAttribute('aria-disabled', 'true');
			}
		}
	};

	onMount(() => {
		hangmanContainer = document.getElementById('hangman-game') as HTMLDivElement | null;
		// play door open audio
		if (userData.playerAllowsSound) {
			audioManager.playAudio('door');
		}
		if (userData.playerAllowsMusic) {
			audioManager.playAudioLoop('creepyWhistlyMusic');
		}

		runHangmanGame();
	});
</script>

{#snippet alphabetLetter(letter)}
	<button class="ouija-board-alphabet-letter" aria-label={letter} onclick={(e) => checkLetter(e)}>
		{letter}
	</button>
{/snippet}
<div class="minigame" id="hangman-game">
	<canvas id="stickman"> Your browser does not support the hangman drawing. </canvas>
	<div class="hangman-phrase-container">
		<div class="hangman-phrase"></div>
	</div>
	<div class="ouija-board-container">
		<img
			src="/images/ouija-board-blank.png"
			alt="Ouija board with selectable letters"
			class="ouija-board-image"
		/>
		<div class="ouija-board-alphabet">
			<div class="ouija-first-line">
				{#each alphabetOne as letter}
					{@render alphabetLetter(letter)}
				{/each}
			</div>
			<div class="ouija-second-line">
				{#each alphabetTwo as letter}
					{@render alphabetLetter(letter)}
				{/each}
			</div>
		</div>
	</div>
</div>
{#if showEndCard}
	<div class="card end-card">
		<p>What do you want to do?</p>
		<button
			class="btn exit-btn"
			onclick={() => {
				showEndCard = false;
				runHangmanGame();
			}}>Play again</button
		>
		<a href="/" class="btn exit-btn">Exit</a>
	</div>
{/if}

<style>
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
	/* Hangman game styles */
	/* load captain howdy font from fonts/captain-howdy.ttf */
	@font-face {
		font-family: 'Captain Howdy';
		src: url('/fonts/captain-howdy.ttf');
	}

	:global(.wooden-table) {
		background: linear-gradient(rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.55)),
			url('/images/wooden-table.webp');

		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	:global(.old-woman) {
		background-image: url('/images/lonely-old-woman.webp');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	#hangman-game {
		display: none;
	}

	#hangman-game:global(.active) {
		display: block;
	}

	#stickman {
		margin: 2em auto;
		display: block;
	}
	#hangman-game :not(.card) :global(button) {
		border: none;
		background-color: transparent;
		font-size: 2rem;
		margin-left: 0.2em;
		font-family: 'Captain Howdy', sans-serif;
	}

	.ouija-board-image {
		display: none;
	}

	.ouija-board-container {
		position: relative;
		max-width: 705px;
		margin: 0 auto;
	}

	.ouija-board-alphabet {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%);
		width: 80%;
		text-align: center;
		color: #000;
	}

	.hangman-phrase-container {
		width: 90%;
		margin: 0 auto;
		margin-bottom: 2em;
	}

	.hangman-phrase {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
		margin: 0 1%;
	}

	:global(.hangman-letter-container) {
		position: relative;
		display: flex;
		justify-content: center;
		width: 20px;
		margin: 0 1%;
	}

	:global(.hangman-letter) {
		display: block;
		height: 2rem;
		font-size: 1.25rem;
		font-family: 'Captain Howdy', sans-serif;
		color: transparent;
		width: 100%;
		text-align: center;
		position: relative;
	}

	:global(.hangman-letter.revealed) {
		color: #000;
	}

	:global(.hangman-letter::after) {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 110%;
		height: 2px;
		background-color: #000;
	}

	:global(.hangman-letter-space) {
		position: relative;
		display: inline-block;
		width: 4%;
		margin: 0 1%;
	}

	@media screen and (min-width: 768px) {
		.ouija-board-image {
			display: block;
		}

		:global(.hangman-letter) {
			height: 3rem;
			font-size: 2.2rem;
		}

		#hangman-game :not(.card) :global(button) {
			border: none;
			background-color: transparent;
			font-family: 'Captain Howdy', sans-serif;
		}

		.card > .btn {
			padding: 10px 20px;
			margin: 5px;
			border-radius: 4px;
			cursor: pointer;
			font-weight: bold;
			transition: all 0.3s ease;
			font-size: 1rem;
			&:hover {
				background-color: #1a2227;
				color: #fafafa;
				transform: scale(1.05);
			}
		}

		:global(.hangman-letter-space) {
			width: 1%;
		}

		.hangman-phrase {
			flex-wrap: nowrap;
		}
	}
	/* End Hangman game styles */
</style>
