<script lang="ts">
	import { Anchor, TopNav } from '$lib';
	import { queryState } from '@evolu/svelte';
	import { evolu } from '../app/evolu';
	import { queryBarcodes } from '../app/barcode.data';

	const allBarcodes = queryState(evolu, () => queryBarcodes);
</script>

<TopNav title="bodiky:list">
	<Anchor slot="action" href="/add-barcode" testId="action:add-barcode">&plus; add</Anchor>
</TopNav>

<div class="space-y-3">
	{#each allBarcodes.rows as barcode (barcode.id)}
		<pre>{JSON.stringify(barcode, null, 2)}</pre>
	{/each}
</div>
