<script lang="ts">
	import { goto } from '$app/navigation';
	import { Anchor, TopNav, LayoutPage } from '$lib';
	import { queryState } from '@evolu/svelte';
	import { evolu } from '../app/evolu';
	import { queryBarcodes } from '../app/barcode.data';

	const allBarcodes = queryState(evolu, () => queryBarcodes);
</script>

<LayoutPage>
	<TopNav slot="nav" title="bodiky:list">
		<Anchor slot="action" href="/add-barcode" testId="action:add-barcode">&plus; add</Anchor>
	</TopNav>

	<div slot="content" class="grid grid-cols-2 gap-4">
		{#each allBarcodes.rows as barcode (barcode.id)}
			<button
				class="cursor-pointer rounded-md border border-gray-300 shadow"
				on:click={() => goto(`/view-barcode/${barcode.id}`)}
			>
				<span
					class="flex flex-row items-center justify-between gap-2 p-4"
					style="background-color: {barcode.bgColor}; color: {barcode.textColor}"
				>
					<span class="text-2xl font-bold">{barcode.title}</span>

					{#if barcode.logoUrl}
						<span
							class="flex flex-row items-center justify-center rounded-md border border-gray-200 p-2"
						>
							<img src={barcode.logoUrl} alt="barcode logo" class="h-14" />
						</span>
					{/if}
				</span>
			</button>
		{/each}
	</div>
</LayoutPage>
