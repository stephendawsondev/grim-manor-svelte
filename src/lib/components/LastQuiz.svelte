<script lang="ts">
	let {
		updateContainerBackground
	}: {
		updateContainerBackground: (background: string) => void;
	} = $props();
</script>

<div class="minigame" id="game-lastquiz">
	<div class="game-area-lastquiz">
		<button id="a" class="button-lastquiz"></button>
		<button id="b" class="button-lastquiz"></button>
		<button id="c" class="button-lastquiz"></button>
	</div>
	<h5 id="question">Test</h5>
	<p id="evaluation"></p>
</div>
