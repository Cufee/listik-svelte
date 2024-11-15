<script lang="ts">
	import RandomEmoji from '$lib/components/icons/emoji/RandomEmoji.svelte';
	import Pencil from '$lib/components/icons/Pencil.svelte';
	import Settings from '$lib/components/icons/Settings.svelte';
	import ShoppingCard from '$lib/components/icons/ShoppingCard.svelte';
	import ListItem from '$lib/components/ListItem/index.svelte';
	import { itemStore } from './items.svelte.js';
	import NewItemInput from './NewItemInput.svelte';

	let { data } = $props();
	let items = itemStore(data.list.items);

	let mode: 'shopping' | 'edit' = $state(items.all.length === 0 ? 'edit' : 'shopping');

	const toggleMode = async () => {
		mode = mode === 'shopping' ? 'edit' : 'shopping';
		items.sort();
	};

	const checkItem = (id: string) => {
		items.check(id, mode === 'shopping');
	};
</script>

<div class="flex flex-col gap-4 grow">
	<div class="flex flex-row items-end justify-between gap-4">
		<div class="flex flex-col overflow-hidden">
			<h1 class="text-xl">{data.list.name}</h1>
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
		{#if mode === 'shopping'}
			{#if items.active.length === 0}
				<div
					class="flex flex-col items-center justify-center pb-16 text-lg text-center text-gray-400 grow"
				>
					{#if items.all.length === 0}
						<span> this list does not have any items added yet </span>
						<span>
							use <button class="link" onclick={() => (mode = 'edit')}>edit mode</button> to add your
							first item
						</span>
					{:else}
						<RandomEmoji class="p-2 size-32" />
						<span class="text-2xl"> all done! </span>
						<span> there are no active items in this list </span>
						<button class="p-2 link" onclick={() => (mode = 'edit')}>view all items</button>
					{/if}
				</div>
			{:else if items.unchecked.length === 0}
				<div class="flex flex-col items-center justify-center text-gray-400">
					<RandomEmoji class="size-16" />
					<span class="text-xl"> you're done! </span>
				</div>
			{/if}

			{#each items.unchecked as item}
				<ListItem remove={items.remove} check={checkItem} {item} {mode} />
			{/each}
			{#if items.checked.length > 0}
				<div class="text-xs uppercase bg-white text-base-300 fontbold divider">
					Checked Recently
				</div>
			{/if}
			{#each items.checked as item}
				<ListItem remove={items.remove} check={checkItem} {item} {mode} />
			{/each}
		{:else}
			{#if items.all.length === 0}
				<div class="flex items-center justify-center text-lg text-center text-gray-400 grow">
					<span> use the input below to add your first item </span>
				</div>
			{/if}

			{#each items.all as item}
				<ListItem remove={items.remove} check={checkItem} {item} {mode} />
			{/each}
		{/if}
	</div>

	{#if mode === 'edit'}
		<div class="sticky bottom-0 flex flex-col justify-center w-full py-4 bg-white">
			<div class="w-full bg-white">
				<NewItemInput />
			</div>
		</div>
	{/if}
</div>
