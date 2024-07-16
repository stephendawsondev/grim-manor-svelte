<script lang="ts">
	import { getUserDataContext, getAudioManagerContext } from '$lib/index.svelte';
	import { showDialogueAsync } from '$lib/utils/dialogueGeneration';
	import type { Question, DialogueItem } from '$lib/types';

	let { updateContainerBackground }: { updateContainerBackground: (background: string) => void } =
		$props();

	let userData = getUserDataContext().value;

	// Adjust the question and answer format to match the first quiz
	const questions: Question[] = [
		{
			question: 'How did the young man die?',
			answers: [
				'He was poisoned by his fiancée',
				'He hung himself',
				"He was stabbed by his fiancée's lover"
			],
			correctAnswerIndex: 1
		},
		{
			question: 'And why did that happen?',
			answers: ['His fiancée loved someone else', 'It was an accident', "He kissed another's wife"],
			correctAnswerIndex: 0
		},
		{
			question: 'Where is his body now?',
			answers: [
				'It was put in the lake',
				'It was hidden in the attic',
				'It was buried under the trees next to the house'
			],
			correctAnswerIndex: 2
		}
	];

	let currentQuestionIndex: number = $state(0);
	let score: number = $state(0);
	let quizStarted: boolean = $state(false);
	let answerState: 'correct' | 'incorrect' | null = $state(null);
	let showEndCard: boolean = $state(false);

	// Audio and background updates
	updateContainerBackground('/images/smiling-bride.webp');

	function handlePlay() {
		quizStarted = true;
	}
	function handleAnswer(e: Event, answerIndex: number) {
		let isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswerIndex;
		let answerButton = e.target as HTMLButtonElement;
		answerButton.classList.add(isCorrect ? 'correct' : 'incorrect');

		isCorrect ? score++ : null;

		setTimeout(async () => {
			answerButton.classList.remove('correct', 'incorrect');
			if (currentQuestionIndex + 1 < questions.length) {
				currentQuestionIndex++;
				quizStarted = true;
			} else {
				await showDialogueAsync(score === questions.length ? winDialogue : loseDialogue);
				userData.storyComplete = score === questions.length;
				quizStarted = false;
				if (userData.storyComplete) {
					await showDialogueAsync(endStoryDialogue);
				}
				showEndCard = true;
			}
		}, 1500);
	}

	const finalStartFirstDialogue: DialogueItem[] = [
		{
			text: 'You enter the room with the young man and see a woman seated at a table.'
		},
		{
			text: 'She is completely white and has a manic grin on her face.'
		},
		{
			text: 'The young man gasps, "Elizabeth?".'
		},
		{
			text: 'The ghost bride ignores him and remains focused on you.'
		},
		{
			text: 'She speaks, "There is a story here, can you tell it?"'
		}
	];

	const endStoryDialogue: DialogueItem[] = [
		{
			text: 'Elizabeth: "I loved you, but my heart still belonged to another."'
		},
		{
			text: 'Elizabeth: "His name was Joshua... he was a kind."',
			choices: [
				{
					text: 'Joshua?',
					action: () => {
						updateContainerBackground('/images/cheating.png');
					}
				}
			]
		},
		{
			text: 'Elizabeth: "I wanted to tell you, but I was afraid of what you would do."'
		},
		{
			text: 'Young man: "What do you mean? I don\'t believe I did anything to you."'
		},
		{
			text: 'Elizabeth: "You saw me kissing Joshua. You never told me you saw it, but I knew you did."'
		},
		{
			text: 'Elizabeth: "You poisoned me that night and dressed me in the dress I bought for our wedding."',
			choices: [
				{
					text: 'Poisoned?',
					action: () => {
						updateContainerBackground('/images/poison.webp');
					}
				}
			]
		},
		{
			text: 'Young man: "I... I remember now... I remember the dress... I remember the poison. Eliza-"'
		},
		{
			text: 'Elizabeth: "I know you regret it, because that night you killed yourself too. You hung yourself from the tree outside."',
			choices: [
				{
					text: 'The tree?',
					action: () => {
						updateContainerBackground('/images/tree-now.png');
					}
				}
			]
		},
		{
			text: 'Elizabeth: "But I didn\'t want you to get away from what you did so easily."'
		},
		{
			text: 'Elizabeth: "I cursed you to wander these halls, filled with despair without knowing why."'
		},
		{
			text: 'Young man: "And I have been here ever since... I am so sorry, Elizabeth."'
		},
		{
			text: 'Young man: "Had I spoken to you instead of acting out of anger, we could have been happy."'
		},
		{
			text: 'Young man: "Maybe not together, but at least at peace. I\'m sorry."'
		},
		{
			text: "The ghost bride's face softens."
		},
		{
			text: 'Elizabeth: "I have held onto my anger for so long... I am sorry too."'
		},
		{
			text: 'Elizabeth: "Joshua has long since stopped visiting my grave. I think he may be waiting for me somewhere else."'
		},
		{
			text: 'Elizabeth: "I forgive you, and I hope you can forgive me too."',
			choices: [
				{
					text: '...',
					action: () => {
						updateContainerBackground('/images/reunited.webp');
					}
				}
			]
		},
		{
			text: 'Young man: "I do, Elizabeth. I do."'
		},
		{
			text: 'The ghosts stand together and hold hands, ready to move on.'
		}
	];

	const winDialogue: DialogueItem[] = [
		{
			text: 'The young man sighs, a sigh of relief.'
		},
		{
			text: '"That\'s right I remember now… She said she loved me… But she did not."'
		},
		{
			text: '"I have wandered these halls for centuries filled with pain and anger without knowing why, but my memories left me long ago."'
		},
		{
			text: 'The ghost bride turns to him, "That is not the whole story, you must remember the rest."'
		},
		{
			text: '"What do you mean, Elizabeth?"'
		},
		{
			text: 'The ghost bride\'s manic grin turns to a face of sadness, "You killed me."'
		}
	];

	const loseDialogue: DialogueItem[] = [
		{
			text: 'Unfortunately you have missed some clues. Come back here and try again.'
		}
	];

	const returnedAndComplete: DialogueItem[] = [
		{
			text: 'You enter the room but it is empty. The spirits that were here have moved on.'
		}
	];

	$effect(async () => {
		if (userData.storyComplete) {
			updateContainerBackground('');
			await showDialogueAsync(returnedAndComplete);
			showEndCard = true;
		} else {
			await showDialogueAsync(finalStartFirstDialogue);
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
	{#if showEndCard}
		<div class="card end-card">
			<p>Leave now?</p>
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

	.card {
		background-color: #2a2a2a;
		padding: 20px;
		border-radius: 8px;
		margin: 10px 0;
		width: 100%;
		max-width: 500px;
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
