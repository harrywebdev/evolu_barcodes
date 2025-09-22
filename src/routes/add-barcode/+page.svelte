<script lang="ts">
	import { goto } from '$app/navigation';
	import { Anchor, TopNav, BarcodeForm } from '$lib';
	import { CreateBarcodeSchema } from '../../app/barcode.model';
	import { createBarcode } from '../../app/barcode.data';

	let title = '';
	let code = '';
	let format = '';
	let bgColor = '';
	let textColor = '';
	let logoUrl = '';

	function handleSubmit() {
		const validBarcode = CreateBarcodeSchema.from({
			title,
			code,
			format,
			bgColor,
			textColor,
			logoUrl
		});

		if (!validBarcode.ok) {
			console.error(validBarcode.error);
			alert(validBarcode.error);
			return;
		}

		const barcode = createBarcode(
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

<TopNav title="bodiky:add-barcode">
	<Anchor slot="action" href="/">← home</Anchor>
</TopNav>

<hr class="my-6 border-gray-400" />

<div class="max-w-screen-sm">
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
</div>
