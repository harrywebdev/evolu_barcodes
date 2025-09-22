<script lang="ts">
	import { Anchor, TopNav, LayoutPage } from '$lib';
	import { queryState } from '@evolu/svelte';
	import { page } from '$app/state';
	import { evolu } from '../../../app/evolu';
	import { queryBarcodeById } from '../../../app/barcode.data';
	import { BarcodeId } from '../../../app/barcode.model';
	import { goto } from '$app/navigation';
	import { getOrThrow } from '@evolu/common';
	import { LoadingIndicator } from '$lib';

	const barcodeIdParam = BarcodeId.fromUnknown(page.params.barcode_id);

	if (!barcodeIdParam.ok) {
		// TODO: 404
		goto('/');
	}

	const barcodeId = getOrThrow(barcodeIdParam);

	const barcodeState = queryState(evolu, () => queryBarcodeById(barcodeId));
	const barcode = $derived(barcodeState.rows?.[0]);
</script>

<LayoutPage>
	<TopNav slot="nav" title="bodiky:view">
		<Anchor slot="action" href="/">← home</Anchor>
	</TopNav>

	<div slot="content">
		{#if barcode}
			<div class="rounded-md border border-gray-300 shadow">
				<div
					class="flex flex-row items-center justify-between gap-2 border-b border-gray-300 p-4"
					style="background-color: {barcode.bgColor}; color: {barcode.textColor}"
				>
					<h1 class="text-2xl font-bold">{barcode.title}</h1>

					{#if barcode.logoUrl}
						<div
							class="flex flex-row items-center justify-center rounded-md border border-gray-200 p-2"
						>
							<img src={barcode.logoUrl} alt="barcode logo" class="h-14" />
						</div>
					{/if}
				</div>

				<div class="p-4">
					<p>{barcode.code}</p>
					<p>{barcode.format}</p>
				</div>
			</div>
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
</LayoutPage>
