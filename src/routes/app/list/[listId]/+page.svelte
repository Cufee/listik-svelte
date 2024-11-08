<script lang="ts">
	import Pencil from '$lib/componenets/icons/Pencil.svelte';
	import Plus from '$lib/componenets/icons/Plus.svelte';
	import ShoppingCard from '$lib/componenets/icons/ShoppingCard.svelte';

	let { data } = $props();
	let mode: 'shopping' | 'edit' = $state('shopping');
	const toggleMode = () => {
		mode = mode === 'shopping' ? 'edit' : 'shopping';
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
				class="btn btn-square btn-secondary"
				onclick={toggleMode}
			>
				{#if mode === 'shopping'}
					<Pencil class="size-6" />
				{:else}
					<ShoppingCard class="size-6" />
				{/if}
			</button>
			<a href={`/app/list/${data.list.id}/manage`} class="btn btn-dark">Settings</a>
		</div>
	</div>

	<div class="flex flex-col gap-2 grow">
		{#each data.list.items as item}
			<div class="max-w-3xl p-2 rounded-lg bg-base-200 grow">
				{item.name}
			</div>
		{/each}
	</div>

	{#if mode === 'edit'}
		<div class="sticky bottom-0 flex justify-center w-full">
			<div class="flex max-w-3xl grow">
				<input
					type="text"
					placeholder="bananas"
					class="w-full rounded-r-none input grow bg-base-200"
				/>
				<button class="rounded-l-none btn btn-square btn-primary">
					<Plus class="size-6" />
				</button>
			</div>
		</div>
	{/if}
</div>
