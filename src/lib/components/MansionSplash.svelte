<script lang="ts">
	import { getUserDataContext, getAudioManagerContext } from '$lib/index.svelte';
	import { browser } from '$app/environment';
	let userData = getUserDataContext().value;
	let audioManager = getAudioManagerContext();

	const setVideoSource = (): Promise<string> => {
		return new Promise((resolve, reject) => {
			const videoElement = document.querySelector(
				'#haunted-mansion video'
			) as HTMLVideoElement | null;

			if (!videoElement) {
				reject('Video element not found.');
				return;
			}

			const sourceElement = videoElement.querySelector('source') as HTMLSourceElement | null;
			const windowWidth = window.innerWidth;

			if (!sourceElement) {
				reject('Source element not found.');
				return;
			}

			if (windowWidth <= 600) {
				sourceElement.src = `/images/haunted-mansion-mobile.webm`;
			} else if (windowWidth <= 1024) {
				sourceElement.src = `/images/haunted-mansion-tablet.webm`;
			} else {
				sourceElement.src = `/images/haunted-mansion.webm`;
			}

			videoElement.onloadedmetadata = () => {
				resolve('Video metadata loaded.');
				videoElement.onloadedmetadata = null;
			};

			videoElement.onerror = () => {
				reject('Error loading video.');
				videoElement.onerror = null;
			};

			videoElement.load();
		});
	};

	if (browser) {
		const hauntedMansionView = document?.getElementById('haunted-mansion');
		const enterButton = document?.getElementById('landing-enter');
		if (userData.playerAllowsSound) {
			audioManager.playAudioLoop('thunderstorm');
		}
		if (hauntedMansionView && enterButton) {
			hauntedMansionView.classList.add('in-play');
			setVideoSource();
			// Listen for window resize
			window.addEventListener('resize', setVideoSource);
		}
	}
</script>

<section id="haunted-mansion" class="main-page">
	<video muted autoplay loop playsinline class="landing-page-video" draggable="false">
		<source src="/images/haunted-mansion-mobile.mp4" type="video/webm" />
		<source src="/images/haunted-mansion-mobile.mp4" type="video/mp4" />
	</video>
	<div class="landing-text">
		<p>Tuesday 31st October 2023…</p>
		<p>All Hallows Eve...</p>
		<p>A torrential, thunderous night…</p>
		<p>You seek refuge at an old mansion.</p>
		<button
			id="landing-enter"
			tabindex="0"
			onclick={() => {
				userData.landingPageComplete = true;
				audioManager.stopAudio('thunderstorm');
			}}
		>
			Enter...
		</button>
	</div>
</section>

<style>
	/*LANDING PAGE */
	#haunted-mansion video {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.landing-page-video {
		background-color: #000;
	}

	.landing-text {
		font-family: 'Risque', serif;
		font-size: 1.75rem;
		color: #c9c1af;
		position: absolute;
		z-index: 2;
		left: 10%;
		top: 20%;
	}

	#landing-enter {
		font-size: 2rem;
		display: block;
		width: 100%;
		text-align: center;
		font-family: inherit;
		color: #c9c1af;
		background: transparent;
		margin-top: 1em;
		border: none;
		animation: pulse 1.25s infinite alternate-reverse;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
			color: #fff;
		}
		50% {
			transform: scale(1.1);
			color: hsl(60, 4%, 72%);
		}
		100% {
			transform: scale(1);
			color: #fff;
		}
	}
</style>
