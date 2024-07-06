<script lang="ts">
	import GameContainer from '$lib/components/GameContainer.svelte';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<main>
	{@render children()}
	<GameContainer />
</main>
<button title="Toggle music" id="music-button" class="audio-button music-button">
	<img id="music-icon" src="/images/music_on.webp" alt="music icon" />
</button>

<button title="Toggle sound" id="sound-button" class="audio-button sound-button">
	<img id="sound-icon" src="/images/sound_on.webp" alt="sound icon" />
</button>
