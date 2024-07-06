<section id="mansion-container" class="main-page">
	<img id="background-image" src="/images/scary-mansion.webp" alt="scary mansion image" />
	<div class="overlay-container">
		<a href="hangman" class="interactive" id="door1">
			<img class="door-help" src="/images/golden-magic.png" />
		</a>
		<button class="interactive" id="door2">
			<img class="door-help" src="/images/golden-magic.png" />
		</button>
		<button class="interactive" id="door3">
			<img class="door-help" src="/images/golden-magic.png" />
		</button>
		<button class="interactive" id="door4">
			<img class="door-help" src="/images/golden-magic.png" />
		</button>
		<div class="ghost-container">
			<img
				src="/images/ghostly-man-image.png"
				alt="young male ghost in olden-day clothes"
				class="ghost-image"
			/>
		</div>

		<img id="guide" src="/images/guide.png" alt="Guide image" />
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
