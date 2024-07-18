<script lang="ts">
	import { getUserDataContext, getAudioManagerContext } from '$lib/index.svelte';
	import { showDialogueAsync } from '$lib/utils/dialogueGeneration';
	import type { Question, DialogueItem } from '$lib/types';
	import { onMount } from 'svelte';

	let {
		updateContainerBackground
	}: {
		updateContainerBackground: (background: string) => void;
	} = $props();

	let userData = getUserDataContext().value;
	let audioManager = getAudioManagerContext();

	const questions: Question[] = [
		{
			question: 'What is a banshee traditionally known to do?',
			answers: ['Sing beautifully', 'Laugh loudly', 'Scream or wail', 'Whisper secrets'],
			correctAnswerIndex: 2
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
			question: 'What are floating orbs of light believed to represent in paranormal photography?',
			answers: ['Dust particles', 'Spirits or energy', 'Camera flashes', 'Water droplets'],
			correctAnswerIndex: 1
		},
		{
			question: 'If you were born on Halloween, what star sign would you be?',
			answers: ['Scorpio', 'Libra', 'Virgo', 'Leo'],
			correctAnswerIndex: 0
		}
	];

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
			text: '"You have answered my questions correctly. That young man is buried beneath the large tree behind the mansion."'
		}
	];

	const loseDialogue: Array<DialogueItem> = [
		{
			text: '"No... not you... not at this time..."'
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
					action: () => {
						showEndCard = true;
					}
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
			answerButton.classList.remove('correct', 'incorrect');

			if (currentQuestionIndex + 1 < questions.length) {
				currentQuestionIndex++;
				quizStarted = true;
			} else {
				if (score === questions.length) {
					userData.quizClueObtained = true;
					await showDialogueAsync(winDialogue);
				} else {
					await showDialogueAsync(loseDialogue);
				}
				showScore = true;
				quizStarted = false;
			}
			answerState = null;
		}, 1500);
	}

	onMount(async () => {
		updateContainerBackground('/images/man-with-paper.webp');

		if (userData.quizClueObtained) {
			await showDialogueAsync(returnedAndComplete);
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
			<a class="btn end-quiz-btn" href="/">End Quiz</a>
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
		text-decoration: none;
		font-family: 'Risque', sans-serif;
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
