<script lang="ts">
	import { Input, Button, Select } from '$lib';
	import { BarcodeFormat } from '../../app/barcode.model';
	export let title: string;
	export let code: string;
	export let format: string;
	export let bgColor: string;
	export let textColor: string;
	export let logoUrl: string;
	export let onSubmit: () => void;
	export let buttonLabel: string = 'save';

	let hasBarcodeDetector = 'BarcodeDetector' in globalThis;
	let fileInput: HTMLInputElement | null = null;
	let files: FileList | null = null;

	const formatOptions = BarcodeFormat.members.map((member) => ({
		value: member.expected,
		label: member.expected
	}));

	async function handleFileChange(event: Event) {
		if (!hasBarcodeDetector) {
			return;
		}

		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const image = await createImageBitmap(file);

			const barcodeDetector = new BarcodeDetector({
				formats: ['code_39', 'codabar', 'ean_13']
			});

			barcodeDetector.detect(image).then(
				(barcodes) => {
					if (!barcodes.length) {
						console.log('No barcode detected.');
						alert('No barcode detected.');
						return;
					}

					console.log('Found ', barcodes.length, 'barcodes');

					// go through the barcodes and use the first one that has successfully parsed the BarcodeFormat
					let foundBarcode = false;
					for (const barcode of barcodes) {
						if (BarcodeFormat.from(barcode.format).ok) {
							console.log('Found barcode with format: ', barcode.format);
							code = barcode.rawValue;
							format = barcode.format;
							foundBarcode = true;
							break;
						}
					}

					if (!foundBarcode) {
						console.log('No barcode with valid format found.');
						alert('No barcode with valid format found (out of ' + barcodes.length + ' detected)');
						return;
					}
				},
				(err) => {
					console.error(err);
					alert('Failed to detect barcode.');
				}
			);

			// reset the file input
			files = null;
			if (fileInput) {
				fileInput.value = '';
			}
		}
	}
</script>

<form on:submit|preventDefault={onSubmit} class="space-y-4">
	<Input id="title" label="title" bind:value={title} placeholder="name the barcode." required />

	<fieldset class="mt-4 mb-6 rounded-md border border-gray-300 bg-white p-4">
		<legend class="font-medium text-gray-700">barcode</legend>

		<div class="space-y-4">
			{#if hasBarcodeDetector}
				<input
					type="file"
					class="block w-full max-w-full rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					on:change={handleFileChange}
					bind:files
					bind:this={fileInput}
					accept="image/*"
				/>
			{:else}
				<p class="block h-10 leading-10 text-gray-500">
					Barcode Detector is not supported by this browser.
				</p>
			{/if}

			<Input
				id="code"
				label="code"
				bind:value={code}
				placeholder="enter the barcode code."
				required
			/>

			<Select
				id="format"
				label="format"
				bind:value={format}
				placeholder="select the barcode format."
				options={formatOptions}
				required
			/>
		</div>
	</fieldset>

	<div class="flex flex-row gap-4">
		<Input
			id="bgColor"
			label="bgColor"
			bind:value={bgColor}
			placeholder="barcode background hex color."
		/>

		<Input
			id="textColor"
			label="textColor"
			bind:value={textColor}
			placeholder="barcode text hex color."
		/>
	</div>

	<Input
		id="logoUrl"
		label="logoUrl"
		bind:value={logoUrl}
		placeholder="enter the barcode logo url."
	/>

	<div class="flex gap-3">
		<Button type="submit" variant="primary">{buttonLabel}</Button>
	</div>
</form>
