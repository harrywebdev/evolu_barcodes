<script lang="ts">
	import { Anchor, TopNav, LayoutPage, ErrorMessage } from '$lib';
	import { queryState } from '@evolu/svelte';
	import { page } from '$app/state';
	import { evolu } from '../../../app/evolu';
	import { deleteBarcode, queryBarcodeById, updateBarcodeFormat } from '../../../app/barcode.data';
	import { BarcodeFormatMap, BarcodeId, BarcodeFormat, Barcode } from '../../../app/barcode.model';
	import { goto } from '$app/navigation';
	import { getOrThrow } from '@evolu/common';
	import { LoadingIndicator } from '$lib';
	import JsBarcode from 'jsbarcode';
	import Button from '$lib/components/Button.svelte';
	import { formatDateIso } from '../../../app/utils';
	import encodeQR from 'qr';

	const barcodeIdParam = BarcodeId.fromUnknown(page.params.barcode_id);

	if (!barcodeIdParam.ok) {
		// TODO: 404
		goto('/');
	}

	const barcodeId = getOrThrow(barcodeIdParam);

	const barcodeState = queryState(evolu, () => queryBarcodeById(barcodeId));
	const hasBarcodeLoaded = $derived(barcodeState.rows?.[0] !== undefined);
	const barcodeRow = $derived(Barcode.fromUnknown(barcodeState.rows?.[0]));
	const barcode = $derived(barcodeRow.ok ? barcodeRow.value : null);
	const barcodeError = $derived(barcodeRow.ok ? null : barcodeRow.error);
	const currentBarcodeFormatIndex = $derived(
		BarcodeFormat.members.findIndex((member) => member.expected === barcode?.format)
	);

	let barcodeGenError = $state('');
	let isShowingQr = $derived(barcode?.format === 'qr_code');

	$effect(() => {
		if (barcodeError && hasBarcodeLoaded) {
			console.log(`barcodeError`, barcodeError);
			return;
		}

		if (barcode) {
			console.log(`barcode.format`, barcode.format);
			if (barcode.format === 'qr_code') {
				try {
					const svgElement = encodeQR(barcode.code, 'svg');
					const qrcodeContainer = document.getElementById('qrcode');
					if (qrcodeContainer) {
						qrcodeContainer.innerHTML = svgElement;
					}
				} catch (error) {
					console.error(`QR code error`, error);
					barcodeGenError = (error as Error).message || 'Error generating QR code';
				}
				return;
			}

			try {
				JsBarcode('#barcode', barcode.code, {
					format: BarcodeFormatMap[barcode.format]
				});
				barcodeGenError = '';
			} catch (error) {
				console.error(`JS barcode error`, error);
				if (typeof error === 'string') {
					barcodeGenError = error;
				}
			}
		}
	});

	function handleCycleFormat(
		barcode: Barcode,
		currentIndex: number,
		direction: 'previous' | 'next',
		attempts: number = 1
	) {
		if (barcode.format) {
			let newIndex;
			switch (direction) {
				case 'previous': {
					newIndex = currentIndex > 0 ? currentIndex - 1 : BarcodeFormat.members.length - 1;
					break;
				}
				case 'next': {
					newIndex = currentIndex < BarcodeFormat.members.length - 1 ? currentIndex + 1 : 0;
					break;
				}
			}

			if (newIndex !== undefined) {
				const newFormat = BarcodeFormat.members[newIndex].expected;

				// now try to generate the barcode with the new format and if it succeeds, update the format
				if (newFormat === 'qr_code') {
					updateBarcodeFormat(barcodeId, newFormat);
					return;
				}

				try {
					const testImageElement = document.createElement('img');

					JsBarcode(testImageElement, barcode.code, {
						format: BarcodeFormatMap[newFormat]
					});

					updateBarcodeFormat(barcodeId, newFormat);
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (error) {
					// try the next format, unless we've tried all formats
					if (attempts < BarcodeFormat.members.length) {
						handleCycleFormat(barcode, newIndex, direction, attempts + 1);
					}
				}
			}
		}
	}

	function handleDelete(barcodeId: BarcodeId) {
		if (confirm('Are you sure you want to delete this barcode?')) {
			deleteBarcode(barcodeId);

			goto('/');
		}
	}
</script>

<LayoutPage>
	<TopNav slot="nav" title="bodiky:view">
		<Anchor slot="action" href="/">← home</Anchor>
	</TopNav>

	<div slot="content">
		{#if barcode}
			<div class="rounded-md border border-gray-300 shadow">
				<div
					class="flex flex-row items-center justify-between gap-2 rounded-t-md border-b border-gray-300 p-4"
					style="background-color: {barcode.bgColor}; color: {barcode.textColor}"
				>
					<h1 class="text-2xl font-bold">{barcode.title}</h1>

					{#if barcode.logoUrl}
						<div class="flex flex-row items-center justify-center">
							<img src={barcode.logoUrl} alt="barcode logo" class="h-14 rounded-md" />
						</div>
					{/if}
				</div>

				<div class="p-4">
					{#if barcodeGenError}
						<ErrorMessage errorMessage={barcodeGenError} />
					{/if}

					{#if isShowingQr}
						<div id="qrcode" class="block h-auto w-full"></div>
					{:else}
						<img id="barcode" class="block h-auto w-full" alt="" />
					{/if}

					<div class="mt-4 flex flex-row justify-between text-center text-gray-400 relative">
						<div class="absolute left-0 top-1/2 -translate-y-1/2">
							<Button
								variant="secondary"
								on:click={() => handleCycleFormat(barcode, currentBarcodeFormatIndex, 'previous')}
							>
								&lt;
							</Button>
						</div>

						<div class="max-w-full">
							<div class="max-w-full whitespace-break-spaces px-12 break-words">{barcode.code} | {barcode.format}</div>
							<div>
								<Anchor href="/edit-barcode/{barcode.id}">&plusmn; edit</Anchor>
							</div>
							<div>&star; {formatDateIso(barcode.createdAt, true)}</div>
						</div>

						<div class="absolute right-0 top-1/2 -translate-y-1/2">
							<Button
								variant="secondary"
								on:click={() => handleCycleFormat(barcode, currentBarcodeFormatIndex, 'next')}
							>
								&gt;
							</Button>
						</div>
					</div>
				</div>

				<div class="flex justify-center bg-gray-200 p-2">
					<Button variant="secondary" on:click={() => handleDelete(barcode.id)}
					>&times; delete
					</Button
					>
				</div>
			</div>
		{:else if barcodeError && hasBarcodeLoaded}
			<ErrorMessage errorMessage={JSON.stringify(barcodeError)} />
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
</LayoutPage>
