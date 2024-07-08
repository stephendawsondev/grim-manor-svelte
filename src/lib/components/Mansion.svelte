<script lang="ts">
	import { browser } from '$app/environment';
	import Spirit from '$lib/components/Spirit.svelte';
	import { getUserDataContext } from '$lib/index.svelte';

	let userData = getUserDataContext().value;
	if (browser) {
		const ghost = document?.querySelector('.ghost-image');
		if (ghost) {
			ghost.classList.add('active');
		}
	}
</script>

<section id="mansion-container" class="main-page">
	<img id="background-image" src="/images/scary-mansion.webp" alt="scary mansion" />
	<div class="overlay-container">
		{#if !userData.firstTimePlaying}
			<a href="hangman" class="interactive" id="door1">
				<Spirit duration={12} color={userData.hangmanClueObtained ? 'white' : '#6ab5cd'} />
			</a>
			{#if userData.backDoorOpened}
				<a href="final-quiz" class="interactive" id="door2">
					<Spirit duration={3} color={userData.storyComplete ? 'white' : 'red'} />
				</a>
			{/if}
			<a href="memory" class="interactive" id="door3">
				<Spirit duration={10} color={userData.memoryClueObtained ? 'white' : '#6ab5cd'} />
			</a>
			<a href="quiz" class="interactive" id="door4">
				<Spirit duration={8} color={userData.quizClueObtained ? 'white' : '#6ab5cd'} />
			</a>
		{/if}
		<div class="ghost-container">
			<img
				src="/images/ghostly-man-image.png"
				alt="young male ghost in olden-day clothes"
				class="ghost-image"
			/>
		</div>
	</div>

	<aside id="dialogue-box" class="dialogue-box" role="dialog">
		<p id="dialogue-text" class="dialogue-text"></p>
		<div id="choices-container" class="choices-container"></div>
		<svg
			width="40px"
			height="40px"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			class="chevron-right"
		>
			<g>
				<path
					id="Vector"
					d="M10 8L14 12L10 16"
					stroke="#000000"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</g>
		</svg>
	</aside>
</section>
