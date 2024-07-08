<script lang="ts">
	let { duration, color = '#6ab5cd' } = $props();
</script>

<div class="spirit-container">
	<div class="face" style="--duration:{duration}s; --orb-color:{color};">
		<div class="circle"></div>
	</div>
</div>

<style>
	.spirit-container {
		font-size: 10px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.spirit-container .face {
		position: absolute;
		width: 3em;
		height: 3em;
		color: var(--orb-color);
		border-radius: 50%;
		animation: move 10s infinite ease-in-out;
		animation-duration: var(--duration);
	}

	.spirit-container .face::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: currentColor;
		border-radius: 50%;
		animation: glow 5s linear infinite;
	}

	@keyframes move {
		0%,
		100% {
			offset-path: path(
				'M56.5 0.5C27.1667 9.33333 -22.4 38.7 14 85.5C59.5 144 68.5 63.5 97 85.5C125.5 107.5 106 180.5 67 164.5C28 148.5 14 73.5 60.5 69C107 64.5 104.5 10 82.5 9C60.5 8 -11 91 5 103.5C21 116 66.5 147.5 76.5 132.5C86.5 117.5 127.5 39.5 102 20C81.6 4.4 63.1667 0.5 56.5 0.5Z'
			);
			offset-distance: 0%;
		}
		50% {
			offset-distance: 50%;
		}
	}

	@keyframes glow {
		0%,
		100% {
			box-shadow:
				0 0 0.5em,
				0 0 1em,
				0 0 1.5em,
				0 0 2em,
				0 0 2.5em,
				0 0 0 0.1em rgba(103, 147, 243, 0.1);
			opacity: 0.75;
		}
		50% {
			box-shadow:
				0 0 1em,
				0 0 2em,
				0 0 3em,
				0 0 4em,
				0 0 5em,
				0 0 0 0.3em rgba(84, 115, 180, 0.5);
			opacity: 0.95;
		}
	}
</style>
