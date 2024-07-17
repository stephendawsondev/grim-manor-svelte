<script lang="ts">
	let { cardName }: { cardName: string } = $props();
</script>

<div class="memory-card" data-framework={cardName}>
	<img class="front-face" src="/images/{cardName}_color.png" alt={cardName} />
	<img class="back-face" src="/images/card-back.webp" alt="Back of Card" />
</div>

<style>
	.memory-card {
		aspect-ratio: 155 / 255;
		width: 100%;
		position: relative;
		transform: scale(1);
		transform-style: preserve-3d;
		transition: transform 0.5s;
		box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
	}
	.memory-card:active {
		transform: scale(0.97);
		transition: transform 0.2s;
	}

	.memory-card:global(.flip) {
		transform: rotateY(180deg);
	}

	.front-face,
	.back-face {
		width: 100%;
		height: 100%;
		position: absolute;
		border-radius: 5px;
		background: #57615f;
		backface-visibility: hidden;
		object-fit: cover;
	}

	.front-face {
		transform: rotateY(180deg);
	}

	@media screen and (min-width: 768px) {
		.memory-card {
			aspect-ratio: 1 / 1.5;
		}
	}
</style>
