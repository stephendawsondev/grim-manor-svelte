<script lang="ts">
	import MansionSplash from '$lib/components/MansionSplash.svelte';
	import Mansion from '$lib/components/Mansion.svelte';
	import { getUserDataContext } from '$lib/index.svelte';

	let userData = getUserDataContext().value;
</script>

{#if userData}
	{#if userData.landingPageComplete == true}
		<Mansion />
	{:else}
		<MansionSplash />
	{/if}
{:else}
	<p>Loading user data...</p>
{/if}
