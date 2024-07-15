<script lang="ts">
	import { getUserDataContext, getAudioManagerContext } from '$lib/index.svelte';
	import { showDialogueAsync } from '$lib/utils/dialogueGeneration';

	let {
		updateContainerBackground
	}: {
		updateContainerBackground: (background: string) => void;
	} = $props();

	let userData = getUserDataContext().value;
	let audioManager = getAudioManagerContext();

	interface Question {
		question: string;
		answers: string[];
		correctAnswerIndex: number;
	}

	const questions: Question[] = [
		{
			question: "What is the name of the killer in the 'Halloween' movie?",
			answers: ['Michael Myers', 'Jason Voorhees', 'Freddy Krueger', 'Leatherface'],
			correctAnswerIndex: 0
		},
		{
			question: 'Which phobia means you have an intense fear of Halloween?',
			answers: ['Halloweenophobia', 'Hallowsphobia', 'Samhainophobia', 'Arachnophobia'],
			correctAnswerIndex: 2
		},
		{
			question: 'Halloween is also known as All Hallows Eve but what is another name for Hallows?',
			answers: ['Ghouls', 'Ghosts', 'Saints', 'Howls'],
			correctAnswerIndex: 2
		},
		{
			question: 'Which famous magician died on Halloween in 1926?',
			answers: ['Harry Houdini', 'David Copperfield', 'David Blaine', 'Derren Brown'],
			correctAnswerIndex: 0
		},
		{
			question: 'If you were born on Halloween, what star sign would you be?',
			answers: ['Scorpio', 'Libra', 'Virgo', 'Leo'],
			correctAnswerIndex: 0
		}
	];

	interface DialogueItem {
		text: string;
		choices?: {
			text: string;
			link?: string;
			action?: () => void;
		}[];
	}

	const introDialogue: Array<DialogueItem> = [
		{
			text: 'You enter the room and see a pale, older gentleman with cobwebs dangling from his clothes, as if he had been standing in place for years.'
		},
		{
			text: "He looks up from the paper in his hands to address you. He doesn't smile."
		},
		{
			text: '"Ah, a visitor! I have a few questions for you. Answer them correctly, and I shall tell you where the young man is."'
		}
	];

	const winDialogue: Array<DialogueItem> = [
		{
			text: 'The seems to grow paler, if that were possible, as he looks at you.'
		},
		{
			text: '"You have answered my questions correctly. The young is buried beneath the large tree behind the mansion."',
			choices: [
				{
					text: 'Thank you, sir.',
					link: '/',
					action: () => {
						showEndCard = true;
					}
				}
			]
		}
	];

	const loseDialogue: Array<DialogueItem> = [
		{
			text: '"No... not you... not at this time..."',
			choices: [
				{
					text: 'Leave',
					link: '/',
					action: () => {
						updateContainerBackground('/images/man-with-paper.webp');
					}
				}
			]
		}
	];

	const returnedAndComplete: Array<DialogueItem> = [
		{
			text: 'The man stares are you as you enter the room.'
		},
		{
			text: '"I have already given you the information you seek."'
		},
		{
			text: '"You know he is buried beneath the large tree behind the mansion."'
		},
		{
			text: '...'
		},
		{
			text: '"Did you want to test your knowledge again?"',
			choices: [
				{
					text: 'Yes',
					action: () => {
						handlePlay();
					}
				},
				{
					text: 'No',
					link: '/'
				}
			]
		}
	];

	let currentQuestionIndex = $state(0);
	let score = $state(0);
	let answerState: 'correct' | 'incorrect' | null = $state(null);
	let showScore: boolean = $state(false);
	let showEndCard: boolean = $state(false);
	let endText: string = $state('');
	let quizStarted: boolean = $state(false);

	// play door open audio
	if (userData.playerAllowsSound) {
		audioManager.playAudio('door');
	}
	if (userData.playerAllowsMusic) {
		audioManager.playAudioLoop('creepyWhistlyMusic');
	}

	function handlePlay() {
		quizStarted = true;
	}

	function handleAnswer(e: Event, answerIndex: number) {
		let isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswerIndex;
		let answerButton = e.target as HTMLButtonElement;
		if (isCorrect) {
			score++;
			answerState = 'correct';
			answerButton.classList.add('correct');
		} else {
			answerState = 'incorrect';
			answerButton.classList.add('incorrect');
		}

		setTimeout(async () => {
			answerState = null;
			currentQuestionIndex++;
			if (currentQuestionIndex >= questions.length) {
				if (score === questions.length) {
					userData.quizClueObtained = true;
					await showDialogueAsync(winDialogue);
				} else {
					await showDialogueAsync(loseDialogue);
				}
				showScore = true;
				quizStarted = false;
			} else {
				quizStarted = true;
			}

			answerButton.classList.remove('correct', 'incorrect');
		}, 1500);
	}

	$effect(async () => {
		updateContainerBackground('/images/man-with-paper.webp');

		if (userData.quizClueObtained) {
			showDialogueAsync(returnedAndComplete);
		} else {
			await showDialogueAsync(introDialogue);

			handlePlay();
		}
	});
</script>

<div class="quiz-container">
	{#if quizStarted}
		<div class="card question-card">
			<p>{questions[currentQuestionIndex].question}</p>
			<div class="answer-buttons">
				{#each questions[currentQuestionIndex].answers as answer, index}
					<button
						class={`btn answer-btn ${answerState === 'correct' && index === questions[currentQuestionIndex].correctAnswerIndex ? 'correct' : ''}`}
						onclick={(e) => handleAnswer(e, index)}
						disabled={answerState !== null}
					>
						{answer}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if showScore}
		<div class="card score-card">
			<p>Score: {score}/{questions.length}</p>
			<button
				class="btn play-again-btn"
				onclick={() => {
					currentQuestionIndex = 0;
					score = 0;
					quizStarted = true;
					showScore = false;
				}}>Play Again</button
			>
			<button
				class="btn end-quiz-btn"
				onclick={() => {
					showEndCard = true;
					showScore = false;
				}}>End Quiz</button
			>
		</div>
	{/if}

	{#if showEndCard}
		<div class="card end-card">
			<p>{endText}</p>
			<a href="/" class="btn exit-btn">Exit</a>
		</div>
	{/if}
</div>

<style>
	.quiz-container {
		height: 100%;
		width: 100%;
		color: #fafafa;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
		text-align: center;
		* {
			font-size: 1.25rem;
		}
		p {
			font-size: 1.5rem;
		}
	}

	.btn.answer-btn.correct {
		background-color: #4caf50;
		color: white;
		animation: fadeBackground 0.5s;
	}

	.btn.answer-btn.incorrect {
		background-color: #f44336;
		color: white;
		animation: fadeBackground 0.5s;
	}

	@keyframes fadeBackground {
		from {
			opacity: 0.5;
		}
		to {
			opacity: 1;
		}
	}

	.btn:hover {
		transform: scale(1.05);
	}

	.card {
		background-color: #2a2a2a;
		padding: 20px;
		border-radius: 8px;
		margin: 10px 0;
		width: 100%;
		max-width: 500px;
	}

	.btn {
		background-color: #fafafa;
		color: #1a1a1a;
		border: none;
		padding: 10px 20px;
		margin: 5px;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.btn:hover {
		background-color: #1a2227;
		color: #fafafa;
		transform: scale(1.05);
	}

	.answer-buttons {
		display: flex;
		flex-direction: column;
	}

	.answer-btn {
		margin: 5px 0;
	}
</style>
