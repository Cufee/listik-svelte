<script lang="ts">
	import Pencil from '$lib/components/icons/Pencil.svelte';
	import Settings from '$lib/components/icons/Settings.svelte';
	import ShoppingCard from '$lib/components/icons/ShoppingCard.svelte';
	import ListItem from '$lib/components/ListItem/index.svelte';
	import { tick, untrack } from 'svelte';
	import { itemStore } from './items.svelte.js';
	import NewItemInput from './NewItemInput.svelte';

	let { data, form } = $props();
	let items = itemStore(data.list.items);

	$effect(() => {
		if (form?.success) {
			if (form.action === 'save-item') {
				// on form submit, add the new item to items array
				// if this item already exists, remove it and push to end
				untrack(async () => {
					items.push(form.item);

					await tick();
					window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight });
				});
			}
			if (form.action === 'delete-item') {
				untrack(() => {
					items.remove(form.item);
				});
			}
		}
	});

	let newItemInput: any = $state(null);

	let mode: 'shopping' | 'edit' = $state(data.list.items.length === 0 ? 'edit' : 'shopping');
	const toggleMode = async () => {
		mode = mode === 'shopping' ? 'edit' : 'shopping';
		items.sort();

		await tick();
		newItemInput?.focus();
		newItemInput?.clearError();
	};

	const checkItem = (id: string) => {
		items.check(id, mode === 'shopping');
	};
</script>

<div class="flex flex-col gap-4 grow">
	<div class="flex flex-row justify-between gap-4 items-top">
		<div class="flex flex-col overflow-hidden">
			<h1 class="text-xl">{data.list.name}</h1>
			{#if data.list.description}
				<span class="text-gray-500 break-words line-clamp-2">{data.list.description}</span>
			{/if}
		</div>
		<div class="flex gap-2">
			<button
				title={mode === 'shopping' ? 'Edit List' : 'Shopping Mode'}
				class="text-white transition-colors bg-blue-400 hover:bg-blue-500 btn btn-square"
				onclick={toggleMode}
			>
				{#if mode === 'shopping'}
					<Pencil class="size-6" />
				{:else}
					<ShoppingCard class="size-6" />
				{/if}
			</button>
			<a href={`/app/list/${data.list.id}/manage`} class="btn btn-dark btn-square">
				<Settings class="size-6" />
			</a>
		</div>
	</div>

	<div class="flex flex-col gap-2 grow">
		{#if items.all.length === 0}
			<span class="p-4 text-lg text-center text-gray-400">
				{mode === 'shopping'
					? 'this list has no unfinished items'
					: 'use the input below to add a new item'}
			</span>
		{/if}
		{#if mode === 'shopping'}
			{#each items.unchecked as item}
				<ListItem check={checkItem} {item} {mode} />
			{/each}
			{#if items.checked.length > 0}
				<div class="text-xs uppercase text-base-300 fontbold divider">Checked Recently</div>
			{/if}
			{#each items.checked as item}
				<ListItem check={checkItem} {item} {mode} />
			{/each}
		{:else}
			{#each items.all as item}
				<ListItem check={checkItem} {item} {mode} />
			{/each}
		{/if}
	</div>

	{#if mode === 'edit'}
		<div class="sticky bottom-0 flex flex-col justify-center w-full py-2 bg-white">
			<div class="w-full bg-white">
				<NewItemInput bind:this={newItemInput} values={form?.values} errors={form?.errors} />
			</div>
		</div>
	{/if}
</div>
