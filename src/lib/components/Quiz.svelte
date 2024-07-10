<script lang="ts">
	import { getUserDataContext, getAudioManagerContext } from '$lib/index.svelte';

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

	let currentQuestionIndex = $state(0);
	let score = $state(0);
	let showQuestion = $state(false);
	let showResult = $state(false);
	let showScore = $state(false);
	let showEndCard = $state(false);
	let isCorrect = $state(false);
	let endText = $state('');

	// play door open audio
	if (userData.playerAllowsSound) {
		audioManager.playAudio('door');
	}
	if (userData.playerAllowsMusic) {
		audioManager.playAudioLoop('creepyWhistlyMusic');
	}

	function handlePlay() {
		showQuestion = true;
	}

	function handleAnswer(answerIndex: number) {
		isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswerIndex;
		if (isCorrect) score++;
		showResult = true;

		currentQuestionIndex++;
		if (currentQuestionIndex >= questions.length) {
			showScore = true;
		}
	}

	function handleNext() {
		showResult = false;
		if (currentQuestionIndex < questions.length) {
			showQuestion = true;
		} else {
			showScore = true;
		}
	}

	function handlePlayAgain() {
		currentQuestionIndex = 0;
		score = 0;
		showQuestion = true;
		showResult = false;
		showScore = false;
		showEndCard = false;
	}

	function handleEndQuiz() {
		endText = 'The young man is buried under the trees next to the mansion';
		showEndCard = true;
	}

	function handleConfirmEnd() {
		endText = 'I wish you well in the next stage!';
	}
</script>

<div class="quiz-container">
	<h2>Halloween Quiz</h2>

	{#if !showQuestion && !showResult && !showScore && !showEndCard}
		<button class="btn play-btn" onclick={handlePlay}>Play</button>
	{/if}

	{#if showQuestion}
		<div class="card question-card">
			<p>{questions[currentQuestionIndex].question}</p>
			<div class="answer-buttons">
				{#each questions[currentQuestionIndex].answers as answer, index}
					<button class="btn answer-btn" onclick={() => handleAnswer(index)}>{answer}</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if showResult}
		<div class="card result-card">
			<p>{isCorrect ? 'Correct!' : 'Wrong!'}</p>
			{#if !isCorrect}
				<p>
					The correct answer is: {questions[currentQuestionIndex - 1].answers[
						questions[currentQuestionIndex - 1].correctAnswerIndex
					]}
				</p>
			{/if}
			<button class="btn next-btn" onclick={handleNext}>Next</button>
		</div>
	{/if}

	{#if showScore}
		<div class="card score-card">
			<p>Score: {score}/{questions.length}</p>
			{#if score >= 3}
				<p>Congratulations! You've earned a clue.</p>
			{:else}
				<p>Sorry, you didn't score high enough to get to the next stage.</p>
			{/if}
			<button class="btn play-again-btn" onclick={handlePlayAgain}>Play Again</button>
			<button class="btn end-quiz-btn" onclick={handleEndQuiz}>End Quiz</button>
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
		background-color: #1a1a1a;
		color: #fafafa;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
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

	.play-btn {
		font-size: 1.2em;
	}

	.answer-buttons {
		display: flex;
		flex-direction: column;
	}

	.answer-btn {
		margin: 5px 0;
	}

	h2 {
		margin-bottom: 20px;
	}
</style>
