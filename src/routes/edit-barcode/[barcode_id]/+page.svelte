<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Anchor, TopNav, BarcodeForm, LayoutPage, LoadingIndicator } from '$lib';
	import { BarcodeId, UpdateBarcodeSchema } from '../../../app/barcode.model';
	import { queryBarcodeById, updateBarcode } from '../../../app/barcode.data';
	import { evolu } from '../../../app/evolu';
	import { getOrThrow } from '@evolu/common';
	import { queryState } from '@evolu/svelte';

	const barcodeIdParam = BarcodeId.fromUnknown(page.params.barcode_id);

	if (!barcodeIdParam.ok) {
		// TODO: 404
		goto('/');
	}

	const barcodeId = getOrThrow(barcodeIdParam);

	const barcodeState = queryState(evolu, () => queryBarcodeById(barcodeId));
	const barcode = $derived(barcodeState.rows?.[0]);

	let id = barcodeId;
	let title = $state('');
	let code = $state('');
	let format = $state('');
	let bgColor = $state('');
	let textColor = $state('');
	let logoUrl = $state('');

	$effect(() => {
		if (!barcode) {
			return;
		}

		title = barcode.title ?? '';
		code = barcode.code ?? '';
		format = barcode.format ?? '';
		bgColor = barcode.bgColor ?? '';
		textColor = barcode.textColor ?? '';
		logoUrl = barcode.logoUrl ?? '';
	});

	function handleSubmit() {
		const validBarcode = UpdateBarcodeSchema.from({
			id,
			title,
			code,
			format,
			bgColor,
			textColor,
			logoUrl: logoUrl !== '' ? logoUrl : null
		});

		if (!validBarcode.ok) {
			console.error(validBarcode.error);
			alert(validBarcode.error);
			return;
		}

		const barcode = updateBarcode(
			validBarcode.value.id,
			validBarcode.value.title,
			validBarcode.value.code,
			validBarcode.value.format,
			validBarcode.value.bgColor,
			validBarcode.value.textColor,
			validBarcode.value.logoUrl
		);

		if (!barcode.ok) {
			console.error(barcode.error);
			alert(barcode.error);
			return;
		}

		goto(`/view-barcode/${barcode.value.id}`);
	}
</script>

<LayoutPage>
	<TopNav slot="nav" title="bodiky:edit">
		<Anchor slot="action" href="/view-barcode/{barcodeId}">← back</Anchor>
	</TopNav>

	<div slot="content">
		{#if barcode}
			<BarcodeForm
				bind:title
				bind:code
				bind:format
				bind:bgColor
				bind:textColor
				bind:logoUrl
				onSubmit={handleSubmit}
				buttonLabel="save barcode"
			/>
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
</LayoutPage>
