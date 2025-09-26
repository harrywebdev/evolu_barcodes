<script lang="ts">
	import '../app.css';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/icon.png" />
</svelte:head>

{@render children?.()}

<div class="mt-20 text-center text-xs text-gray-500">
	Version: {data.version}
	{#if data.VERCEL_GIT_COMMIT_SHA}
		({data.VERCEL_GIT_COMMIT_SHA})
	{/if}
</div>
