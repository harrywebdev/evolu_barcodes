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

	const formatOptions = BarcodeFormat.members.map((member) => ({
		value: member.expected,
		label: member.expected
	}));
</script>

<form on:submit|preventDefault={onSubmit} class="space-y-4">
	<Input id="title" label="title" bind:value={title} placeholder="name the barcode." required />

	<Input id="code" label="code" bind:value={code} placeholder="enter the barcode code." required />

	<Select
		id="format"
		label="format"
		bind:value={format}
		placeholder="select the barcode format."
		options={formatOptions}
		required
	/>

	<Input
		id="bgColor"
		label="bgColor"
		bind:value={bgColor}
		placeholder="barcode background hex color."
		required
	/>

	<Input
		id="textColor"
		label="textColor"
		bind:value={textColor}
		placeholder="barcode text hex color."
		required
	/>

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
