<script lang="ts">
	import { enhance } from '$app/forms';
	import { autofocus } from '$lib/actions/autofocus';
	import Pencil from '$lib/components/icons/Pencil.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import Settings from '$lib/components/icons/Settings.svelte';
	import ShoppingCard from '$lib/components/icons/ShoppingCard.svelte';
	import ListItem from '$lib/components/ListItem/index.svelte';
	import { tick, untrack } from 'svelte';
	import { itemStore } from './items.svelte.js';

	let { data, form } = $props();
	let items = itemStore(data.list.items);

	$effect(() => {
		if (form?.success) {
			if (form.action === 'save-item') {
				// on form submit, add the new item to items array
				// if this item already exists, remove it and push to end
				untrack(() => {
					items.push(form.item);
				});
			}
			if (form.action === 'delete-item') {
				untrack(() => {
					items.remove(form.item);
				});
			}
		}
	});

	let newItemInput: HTMLInputElement | null = $state(null);
	let mode: 'shopping' | 'edit' = $state(data.list.items.length === 0 ? 'edit' : 'shopping');
	const toggleMode = async () => {
		mode = mode === 'shopping' ? 'edit' : 'shopping';
		items.sort();

		await tick();
		newItemInput?.focus();
	};

	const clearError = (event: Event) => {
		const target = event.target as HTMLInputElement;
		target.classList.remove('input-error');
		target.placeholder = target.dataset.placeholder ?? '';
	};

	const checkItem = (id: string) => {
		items.check(id, mode === 'shopping');
	};
</script>

<div class="flex flex-col gap-4 grow">
	<div class="flex flex-row justify-between gap-4 items-top">
		<div class="flex flex-col">
			<h1 class="text-xl">{data.list.name}</h1>
			{#if data.list.description}
				<span>{data.list.description}</span>
			{/if}
		</div>
		<div class="flex gap-2">
			<button
				title={mode === 'shopping' ? 'Edit List' : 'Shopping Mode'}
				class="transition-colors bg-blue-400 hover:bg-blue-500 btn btn-square"
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
				<div class="text-xs uppercase text-base-300 fontbold divider">Checked</div>
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
		<div class="sticky bottom-0 flex justify-center w-full">
			<form class="flex max-w-3xl grow" method="POST" action="?/save-item" use:enhance>
				<!-- svelte-ignore a11y_autofocus -->
				<input
					bind:this={newItemInput}
					autofocus={true}
					use:autofocus
					name="name"
					type="text"
					minlength="3"
					maxlength="32"
					data-placeholder="bananas"
					class="w-full rounded-r-none input grow bg-base-200"
					placeholder={form?.errors?.name || 'bananas'}
					class:input-error={!!form?.errors?.name}
					value={form?.values?.name ?? ''}
					oninput={clearError}
				/>
				<button
					type="submit"
					class="transition-colors bg-green-400 rounded-l-none btn btn-square hover:bg-green-500"
				>
					<Plus class="size-6" />
				</button>
			</form>
		</div>
	{/if}
</div>
