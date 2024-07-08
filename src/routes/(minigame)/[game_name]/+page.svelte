<script lang="ts">
	import GameContainer from '$lib/components/GameContainer.svelte';

	let { data } = $props();

	let gameName: string = $derived(data.gameName);
</script>

<GameContainer {gameName} />
