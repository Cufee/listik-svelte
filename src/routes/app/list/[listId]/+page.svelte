<script lang="ts">
	import { enhance } from '$app/forms';
	import Pencil from '$lib/components/icons/Pencil.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import Settings from '$lib/components/icons/Settings.svelte';
	import ShoppingCard from '$lib/components/icons/ShoppingCard.svelte';
	import ListItem from '$lib/components/ListItem/index.svelte';
	import { untrack } from 'svelte';

	let { data, form } = $props();

	let items = $state(data.list.items);
	$effect(() => {
		if (form?.success) {
			if (form.action === 'new-item') {
				// on form submit, add the new item to items array
				// if this item already exists, remove it and push to end
				untrack(() => {
					items = items.filter((i) => i.id !== form.item.id);
					items.push(form.item);
				});
			}
			if (form.action === 'delete-item') {
				untrack(() => {
					items = items.filter((i) => i.id !== form.item);
				});
			}
		}
	});

	let mode: 'shopping' | 'edit' = $state(data.list.items.length === 0 ? 'edit' : 'shopping');
	const toggleMode = () => {
		mode = mode === 'shopping' ? 'edit' : 'shopping';
	};

	const clearError = (event: Event) => {
		const target = event.target as HTMLInputElement;
		target.classList.remove('input-error');
		target.placeholder = target.dataset.placeholder ?? '';
	};

	const checkItem = (id: string) => {
		const item = items.find((i) => i.id === id);
		if (!item) return;
		item.checkedAt = !!item.checkedAt ? null : new Date();
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
		{#if items.length === 0}
			<span class="p-4 text-lg text-center text-gray-400">
				{mode === 'shopping'
					? 'this list has no unfinished items'
					: 'use the input below to add a new item'}
			</span>
		{/if}
		{#each items as item}
			<ListItem check={checkItem} {item} {mode} />
		{/each}
	</div>

	{#if mode === 'edit'}
		<div class="sticky bottom-0 flex justify-center w-full">
			<form class="flex max-w-3xl grow" method="POST" action="?/new-item" use:enhance>
				<input
					name="name"
					type="text"
					minlength="3"
					maxlength="32"
					data-placeholder="bananas"
					class="w-full rounded-r-none input grow bg-base-200"
					placeholder={form?.errors?.name || 'bananas'}
					class:input-error={!!form?.errors?.name}
					value={form?.values?.name}
					oninput={clearError}
				/>
				<button
					formaction="?/new-item"
					class="transition-colors bg-green-400 rounded-l-none btn btn-square hover:bg-green-500"
				>
					<Plus class="size-6" />
				</button>
			</form>
		</div>
	{/if}
</div>
