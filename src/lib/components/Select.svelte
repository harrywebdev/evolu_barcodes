<script lang="ts">
	export let id: string;
	export let label: string;
	export let value: string = '';
	export let options: Array<{ value: string; label: string }> = [];
	export let required: boolean = false;
	export let placeholder: string = '';
</script>

<div class="space-y-2">
	<label for={id} class="block text-sm font-medium text-gray-700">
		{label}
	</label>
	<select
		{id}
		bind:value
		{required}
		class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
	>
		{#if placeholder}
			<option value="" disabled>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
